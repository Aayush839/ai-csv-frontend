import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ChartView({ data }) {
  return (
    <div style={{ width: "100%", height: 300, marginTop: 20 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product_name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="price" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}