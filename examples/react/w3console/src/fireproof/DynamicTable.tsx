export default function DynamicTable({ headers, rows, th = '_id', link = ['_id'] }: any) {
  return (
    <div class="relative overflow-x-auto dark mt-4">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headers.map((header: string) => (
              <th scope="col" class="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((fields: any) => (
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              {headers.map((header: string) =>
                header === th ? (
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <TableCell link={link.includes(header)} label={fields[header]} />
                  </th>
                ) : (
                  <td class="px-6 py-4">
                    <TableCell link={link.includes(header)} label={fields[header]} />
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TableCell({ label, link = false }) {
  if (link) {
    const href = `/fp-doc?id=${label}`
    return <a class="underline" href={href}>{formatTableCellContent(label)}</a>
  } else {
    return <>{formatTableCellContent(label)}</>
  }
}

function formatTableCellContent(obj: any) {
  if (typeof obj === 'string') return obj
  return JSON.stringify(obj)
}
