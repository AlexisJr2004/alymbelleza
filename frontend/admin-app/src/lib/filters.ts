// Filtra una lista por un rango de fechas [desde, hasta] (strings yyyy-mm-dd de un
// <input type="date">, cualquiera de los dos puede estar vacío). Puerto directo de
// filtrarPorRangoDeFechas() del panel viejo, adaptado a recibir los valores en vez
// de leerlos de elementos del DOM.
export function filtrarPorRangoDeFechas<T>(
  lista: T[],
  fechaGetter: (item: T) => string | Date,
  desde: string,
  hasta: string
): T[] {
  let filtrados = lista;
  if (desde) {
    const desdeDate = new Date(`${desde}T00:00:00`);
    filtrados = filtrados.filter((item) => new Date(fechaGetter(item)) >= desdeDate);
  }
  if (hasta) {
    const hastaDate = new Date(`${hasta}T23:59:59`);
    filtrados = filtrados.filter((item) => new Date(fechaGetter(item)) <= hastaDate);
  }
  return filtrados;
}
