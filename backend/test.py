import pandas as pd

# Load the CSV file
file_path = 'orders_export_1.csv'  # Replace with the path to your CSV file
df = pd.read_csv(file_path)

# Remove rows where the "Total" column is "$0.00"
df_filtered = df[df['Total'] != '$0.00']

# List of columns to keep
columns_to_keep = [
    "Name", "Email", "Financial Status", "Paid at", "Fulfillment Status", "Fulfilled at",
    "Accepts Marketing", "Currency", "Subtotal", "Shipping", "Taxes", "Total",
    "Discount Code", "Discount Amount", "Shipping Method", "Created at",
    "Lineitem quantity", "Lineitem name", "Lineitem price", "Lineitem sku",
    "Lineitem requires shipping", "Lineitem taxable", "Billing City",
    "Billing Zip", "Billing Province", "Billing Country"
]

# Keep only the specified columns
df_filtered = df_filtered[columns_to_keep]

# Save the filtered DataFrame back to a CSV file
output_path = 'filtered_file.csv'  # Replace with the desired output file path
df_filtered.to_csv(output_path, index=False)

print("Rows with $0.00 in the 'Total' column have been removed, and only the specified columns have been retained.")
