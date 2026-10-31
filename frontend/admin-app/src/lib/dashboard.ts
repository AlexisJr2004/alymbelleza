import type { Order, Product, User } from '../types/models';
import { construirSerieMensual } from './monthly';

export function percentageChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round((current - previous) / previous * 100);
}

export function buildDashboard(orders: Order[], users: User[], products: Product[], month: string) {
  const [year, number] = month.split('-').map(Number);
  const end = new Date(year, number, 0, 23, 59, 59, 999);
  const includedOrders = orders.filter(order => new Date(order.createdAt) <= end);
  const clients = users.filter(user => user.role === 'cliente' && new Date(user.createdAt) <= end);
  const incomeSeries = construirSerieMensual(includedOrders, order => order.createdAt, order => order.total, end);
  const orderSeries = construirSerieMensual(includedOrders, order => order.createdAt, () => 1, end);
  const clientSeries = construirSerieMensual(clients, user => user.createdAt, () => 1, end);
  const catalog = new Map(products.map(product => [product._id, product]));
  const byName = new Map(products.map(product => [product.name, product]));
  const sales = new Map<string, { id: string; name: string; image?: string; category: string; units: number; amount: number }>();
  for (const order of includedOrders) for (const item of order.items || []) {
    const product = item.product ? catalog.get(item.product) : byName.get(item.name);
    const id = item.product || item.name;
    const entry = sales.get(id) || { id, name: item.name, image: product?.image, category: product?.category === 'capilar' ? 'Cuidado capilar' : product?.category === 'facial' ? 'Cuidado facial' : 'Sin categoría', units: 0, amount: 0 };
    entry.units += item.cantidad;
    entry.amount += item.cantidad * item.price;
    sales.set(id, entry);
  }
  const bestSellers = [...sales.values()].sort((a, b) => b.units - a.units || b.amount - a.amount);
  const categoryTotals = new Map<string, number>();
  for (const item of bestSellers) categoryTotals.set(item.category, (categoryTotals.get(item.category) || 0) + item.units);
  const colors = ['#ee8799', '#f4b7a4', '#b98376'];
  const categories = [...categoryTotals].map(([label, count], index) => ({ label, count, color: colors[index % colors.length] }));
  return {
    income: includedOrders.reduce((sum, order) => sum + order.total, 0),
    orders: includedOrders,
    clients,
    incomeSeries, orderSeries, clientSeries,
    bestSellers, categories,
    totalUnits: bestSellers.reduce((sum, item) => sum + item.units, 0),
    recentOrders: [...includedOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
  };
}
