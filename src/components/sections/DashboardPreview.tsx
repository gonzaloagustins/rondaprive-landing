import {
  BarChart3,
  Layers,
  BarChart,
  Brain,
  ShoppingCart,
  PieChart,
} from "lucide-react";

const modules = [
  { icon: BarChart3, title: "KPIs en vivo", subtitle: "Ventas y ticket promedio" },
  { icon: ShoppingCart, title: "Control de pedidos", subtitle: "Estado en tiempo real" },
  { icon: BarChart, title: "Inventario en vivo", subtitle: "Stock actualizado" },
  { icon: Layers, title: "Gestión de productos", subtitle: "Menús y precios" },
  { icon: PieChart, title: "Analíticas", subtitle: "Insights de consumo" },
  { icon: Brain, title: "Comportamiento", subtitle: "Patrones por hora y zona" },
];

const orders = [
  { id: "#4521", items: "2x Cerveza, 1x Nachos", status: "Listo", statusColor: "bg-[#F0EBE3] text-foreground" },
  { id: "#4520", items: "1x Combo VIP", status: "Preparando", statusColor: "bg-primary/20 text-primary" },
  { id: "#4519", items: "3x Mojito", status: "Entregado", statusColor: "bg-primary/10 text-primary/70" },
];

const barHeights = [40, 55, 45, 65, 50, 75, 60, 80, 55, 70, 65, 85];

const DashboardPreview = () => {
  return (
    <section className="section-dark py-24" id="dashboard">
      <div className="section-container">
        {/* Header */}
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Panel de control
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 leading-tight">
            Todo bajo control.
            <br />
            <span className="text-gradient-gold">En tiempo real.</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl text-lg">
            Un dashboard completo para organizadores y equipos operativos.
            Visualiza ventas, gestiona inventario y toma decisiones informadas al
            instante.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          {/* Left: Feature modules */}
          <div className="grid grid-cols-2 gap-3">
            {modules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-[hsl(28,10%,20%)] bg-[hsl(28,12%,12%)] p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{mod.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {mod.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Dashboard mockup */}
          <div className="rounded-2xl border border-[hsl(28,10%,20%)] bg-[hsl(28,12%,12%)] p-6 space-y-5">
            {/* Traffic lights + title */}
            <div className="flex items-center justify-between pb-4 border-b border-[hsl(28,10%,20%)]">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-muted-foreground italic">
                Ronda Privé Dashboard
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-[hsl(28,10%,20%)] p-4">
                <p className="text-xs text-muted-foreground">Ventas Hoy</p>
                <p className="text-2xl font-bold mt-1">$45,230</p>
                <p className="text-xs text-green-400 mt-1">+12%</p>
              </div>
              <div className="rounded-xl border border-[hsl(28,10%,20%)] p-4">
                <p className="text-xs text-muted-foreground">Pedidos</p>
                <p className="text-2xl font-bold mt-1">1,847</p>
                <p className="text-xs text-green-400 mt-1">+8%</p>
              </div>
              <div className="rounded-xl border border-[hsl(28,10%,20%)] p-4">
                <p className="text-xs text-muted-foreground">Ticket Prom.</p>
                <p className="text-2xl font-bold mt-1">$24.50</p>
                <p className="text-xs text-green-400 mt-1">+5%</p>
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-xl border border-[hsl(28,10%,20%)] p-4">
              <p className="text-xs text-muted-foreground mb-3">Ventas por hora</p>
              <div className="flex items-end gap-1.5 h-28 justify-between">
                {barHeights.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background:
                          "linear-gradient(to top, rgba(213,168,90,0.3), rgba(213,168,90,0.7))",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Orders */}
            <div className="space-y-2">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-[hsl(28,10%,20%)] text-xs"
                >
                  <span>
                    <span className="text-primary font-semibold">{order.id}</span>{" "}
                    {order.items}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Live update button */}
            <div className="text-center pt-2">
              <span className="inline-flex items-center gap-2 bg-[#F0EBE3] text-[#1A1814] text-xs font-semibold px-5 py-2.5 rounded-full">
                Actualización en vivo
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
