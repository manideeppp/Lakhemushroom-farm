import type { NutritionRow } from '../../types/product';
import { Card } from '../ui/Card';

interface ProductNutritionPanelProps {
  basis?: string;
  rows: NutritionRow[];
}

export function ProductNutritionPanel({
  basis,
  rows,
}: ProductNutritionPanelProps) {
  return (
    <Card padding="md" className="bg-cream-50 border-cream-200">
      <h2 className="font-serif text-h3 text-ink-900">
        Specifications & nutritional facts
      </h2>
      {basis && (
        <p className="mt-1 text-caption text-ink-500 uppercase tracking-wide">
          {basis}
        </p>
      )}
      <div className="mt-4 overflow-hidden rounded-lg border border-ink-100 bg-white">
        <table className="w-full text-small">
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-ink-100 last:border-0"
              >
                <th
                  className="px-3 py-2.5 text-left font-medium text-ink-800 bg-sage-50/50 w-[42%]"
                >
                  {row.label}
                </th>
                <td className="px-3 py-2.5 text-ink-700">{row.value}</td>
                {row.dailyValue && (
                  <td className="px-3 py-2.5 text-right text-ink-500 w-[18%]">
                    {row.dailyValue}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-caption text-ink-500">
        * Percent daily values based on a standard adult diet. Values from Lakhe
        Mushroom Farm product specification sheets.
      </p>
    </Card>
  );
}
