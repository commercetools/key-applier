# What is this useful for?

Import and export functionality in Composable Commerce uses the `key` field as the identifier for resources. If your resources do not have a `key`, they cannot be updated via import and their references may be broken in exported files.

As the `key` value is optional, resources within your Composable Commerce Project may lack them.

This app sets boilerplate `key` values to resources, which enables you to fully use the import and export functions within Composable Commerce. The boilerplate `key` values use the format: {resourceType}_{resourceId}.

# How do I set this up?

1. Clone this repository.
2. Install the dependencies using the command:
    ```bash
    npm install
    ```
3. Create a commercetools Composable Commerce [API Client](https://docs.commercetools.com/getting-started/create-api-client) that can manage:
    - Cart Discounts
    - Categories
    - Customers
    - Customer Groups
    - Discount Codes
    - Products
    - Standalone Prices
    - Tax Categories
4. Download the **Environment Variables (.env)** for this API Client.
5. Rename the downloaded file `.env`, and copy it to the cloned repository.
