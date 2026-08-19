import type { NutritionRow } from '../../types/product';
import { Card } from '../ui/Card';

interface ProductNutritionPanelProps {
  basis?: string;
  rows?: NutritionRow[];
  specifications?: NutritionRow[];
}

function NutritionTable({ rows }: { rows: NutritionRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-ink-100 bg-white">
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
              {row.dailyValue ? (
                <td className="px-3 py-2.5 text-right text-ink-500 w-[18%]">
                  {row.dailyValue}
                </td>
              ) : (
                <td className="w-[18%]" />
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProductNutritionPanel({
  basis,
  rows,
  specifications,
}: ProductNutritionPanelProps) {
  if (!rows?.length && !specifications?.length) return null;

  return (
    <Card padding="md" className="bg-cream-50 border-cream-200">
      {specifications && specifications.length > 0 && (
        <div>
          <h2 className="font-serif text-h3 text-ink-900">
            Product specifications
          </h2>
          <div className="mt-4">
            <NutritionTable rows={specifications} />
          </div>
        </div>
      )}

      {rows && rows.length > 0 && (
        <div className={specifications?.length ? 'mt-6' : undefined}>
          <h2 className="font-serif text-h3 text-ink-900">
            Specifications & nutritional facts
          </h2>
          {basis && (
            <p className="mt-1 text-caption text-ink-500 uppercase tracking-wide">
              {basis}
            </p>
          )}
          <div className="mt-4">
            <NutritionTable rows={rows} />
          </div>
        </div>
      )}

      <p className="mt-3 text-caption text-ink-500">
        * Percent daily values based on Lakhe Mushroom Farm product specification
        sheets. RI = Reference Intake; NRV = Nutrient Reference Value.
      </p>
    </Card>
  );
}
