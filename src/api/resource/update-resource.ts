import { graphQlRequest } from "../graphql.js";
import { waitForNextRequest } from "../../utils/fairness.js";
import {
  KeyableResourceType,
  resourceToActionBatches,
  resourceMutationMap,
} from "./keyable-type/index.js";
import { consoleLogger, fileLogger } from "../../lib/log.js";

type ActionBatch = Array<Record<string, any>>;

interface UpdateParams {
  id: string;
  version: number;
  actionBatches: ActionBatch[];
}

const executeGraphQLMutation = async (
  mutation: string,
  variables: Record<string, any>
): Promise<void> => {
  try {
    const response = await graphQlRequest({
      query: mutation,
      variables,
    });

    if (response.body.errors) {
      fileLogger.error(JSON.stringify(response.body.errors, null, 2));
    } else {
      fileLogger.info(JSON.stringify(response.body.data, null, 2));
    }
  } catch (error) {
    consoleLogger.error("GraphQL Request Error:", error);
    if (typeof error === "object" && error && "body" in error) {
      fileLogger.error(error.body);
    } else {
      fileLogger.error(error);
    }

    throw error;
  }
};

const executeUpdateActions = async (
  type: KeyableResourceType,
  { id, version, actionBatches }: UpdateParams
) => {
  const { mutation } = resourceMutationMap[type];

  let actionsApplied = 0;
  for (const actions of actionBatches) {
    const variables = { id, version: version + actionsApplied, actions };

    await executeGraphQLMutation(mutation, variables);

    actionsApplied += actions.length;
    await waitForNextRequest();
  }
};

export const createUpdater = (keyableType: KeyableResourceType) => {
  const updater = async <T extends { id: string; version: number }>(
    resource: T
  ) => {
    const { id, version } = resource;
    const actionBatches = resourceToActionBatches(keyableType, resource);

    await executeUpdateActions(keyableType, { id, version, actionBatches });

    const totalActions = actionBatches.reduce(
      (acc, actions) => acc + actions.length,
      0
    );

    return totalActions;
  };

  return updater;
};
