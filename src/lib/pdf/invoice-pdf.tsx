import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  title: { fontSize: 24, fontFamily: "Helvetica-Bold" },
  meta: { textAlign: "right", color: "#666" },
  section: { marginBottom: 20 },
  label: { color: "#666", fontSize: 9, textTransform: "uppercase", marginBottom: 2 },
  bold: { fontFamily: "Helvetica-Bold" },
  row: { flexDirection: "row" },
  col2: { flex: 1 },
  table: { marginTop: 20 },
  thead: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontFamily: "Helvetica-Bold",
  },
  trow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  cellDesc: { flex: 4 },
  cellQty: { flex: 1, textAlign: "right" },
  cellPrice: { flex: 1.5, textAlign: "right" },
  cellAmount: { flex: 1.5, textAlign: "right" },
  totals: { marginTop: 12, alignSelf: "flex-end", width: 200 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#000",
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  notes: { marginTop: 30, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: "#e5e7eb" },
});

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export type InvoicePdfData = {
  number: string;
  status: string;
  issueDate: Date;
  dueDate: Date;
  notes: string | null;
  subtotal: number;
  taxRate: number;
  total: number;
  fromName: string;
  client: { name: string; email: string | null; address: string | null };
  items: { description: string; quantity: number; unitPrice: number; amount: number }[];
};

export function InvoicePdf({ data }: { data: InvoicePdfData }) {
  const tax = data.total - data.subtotal;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={{ marginTop: 4, color: "#666" }}>{data.number}</Text>
          </View>
          <View style={styles.meta}>
            <Text>Issued: {data.issueDate.toLocaleDateString()}</Text>
            <Text>Due: {data.dueDate.toLocaleDateString()}</Text>
            <Text style={{ marginTop: 4, textTransform: "capitalize" }}>
              Status: {data.status}
            </Text>
          </View>
        </View>

        <View style={[styles.row, styles.section]}>
          <View style={styles.col2}>
            <Text style={styles.label}>Bill to</Text>
            <Text style={styles.bold}>{data.client.name}</Text>
            {data.client.email && <Text>{data.client.email}</Text>}
            {data.client.address && <Text>{data.client.address}</Text>}
          </View>
          <View style={styles.col2}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.bold}>{data.fromName}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.thead}>
            <Text style={styles.cellDesc}>Description</Text>
            <Text style={styles.cellQty}>Qty</Text>
            <Text style={styles.cellPrice}>Unit price</Text>
            <Text style={styles.cellAmount}>Amount</Text>
          </View>
          {data.items.map((it, i) => (
            <View key={i} style={styles.trow}>
              <Text style={styles.cellDesc}>{it.description}</Text>
              <Text style={styles.cellQty}>{it.quantity}</Text>
              <Text style={styles.cellPrice}>{currency.format(it.unitPrice)}</Text>
              <Text style={styles.cellAmount}>{currency.format(it.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={{ color: "#666" }}>Subtotal</Text>
            <Text>{currency.format(data.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ color: "#666" }}>Tax ({data.taxRate}%)</Text>
            <Text>{currency.format(tax)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text>Total</Text>
            <Text>{currency.format(data.total)}</Text>
          </View>
        </View>

        {data.notes && (
          <View style={styles.notes}>
            <Text style={styles.label}>Notes</Text>
            <Text>{data.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
