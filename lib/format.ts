/** Indian digit grouping: 1,215 / 1,20,500. */
export const formatRupees = (n: number) => '₹' + n.toLocaleString('en-IN')
