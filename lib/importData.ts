import { clients } from "./mockData";

/** CRM fields a CSV column can map to. "ignore" = not imported. */
export type CrmField =
  | "name"
  | "phone"
  | "dob"
  | "reference"
  | "renewal"
  | "ignore";

export const crmFieldLabels: Record<CrmField, string> = {
  name: "Full Name",
  phone: "Phone Number",
  dob: "Date of Birth",
  reference: "Policy / Folio Ref",
  renewal: "Renewal Date",
  ignore: "Don't import",
};

export interface SourceFormat {
  key: string;
  label: string;
  /** Product these records represent. */
  product: string;
  /** Header -> CRM field auto-mapping. Headers absent here default to ignore. */
  autoMap: Record<string, CrmField>;
}

export const sourceFormats: SourceFormat[] = [
  {
    key: "wealthmagic",
    label: "WealthMagic (Mutual Funds)",
    product: "MF",
    autoMap: {
      "Client Name": "name",
      Mobile: "phone",
      "Date of Birth": "dob",
      "Folio Number": "reference",
    },
  },
  {
    key: "imagic",
    label: "i-Magic (Life Insurance)",
    product: "LIC",
    autoMap: {
      "Policy Holder Name": "name",
      "Contact Number": "phone",
      DOB: "dob",
      "Policy Number": "reference",
      "Premium Due Date": "renewal",
    },
  },
  {
    key: "esoft",
    label: "eSoft GIC (General Insurance)",
    product: "GIC",
    autoMap: {
      "Insured Name": "name",
      Phone: "phone",
      DOB: "dob",
      "Policy No": "reference",
      "Renewal Date": "renewal",
    },
  },
  {
    key: "other",
    label: "Other / Generic CSV",
    product: "LIC",
    autoMap: {},
  },
];

/** The bundled sample, also served at /public/sample-import.csv. */
export const sampleCsvText = `Client Name,Mobile,Date of Birth,Folio Number,SIP Amount,SIP Date,Fund Name
Rajesh Sharma,9876543210,15/05/1985,MF-NEW-2207,5000,5,Axis Bluechip Fund
Kavita Rao,9811122233,12/08/1988,WM220198,10000,10,SBI Small Cap Fund
Deepak Nair,9822233344,03/02/1979,WM220233,7500,15,HDFC Flexi Cap Fund
V. Desai HUF,5432109876,07/09/1980,WM220245,25000,1,Parag Parikh Flexi Cap
Meena Shah,,19/07/1991,WM220266,3000,20,ICICI Prudential Value
Arjun Reddy,9833344455,25/12/1983,WM220277,12000,1,Mirae Asset Large Cap
Sneha Kulkarni,9844455566,30/04/1995,WM220288,8000,5,Nippon India Growth`;

export interface ParsedCsv {
  headers: string[];
  rows: string[][];
}

/** Minimal CSV parse (no quoted-comma support; fine for these exports). */
export function parseCsv(text: string): ParsedCsv {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((l) => l.split(",").map((c) => c.trim()));
  return { headers, rows };
}

export function lastTen(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

export type RowCategory = "new" | "existing" | "conflict" | "error";

export interface ClassifiedRow {
  index: number;
  cells: string[];
  name: string;
  phone: string;
  dob: string;
  reference: string;
  renewal: string;
  category: RowCategory;
  /** For existing/conflict: the matched client name. */
  matchName?: string;
  /** Reason a row is an error. */
  error?: string;
}

/** Classify each parsed row against existing clients using the column mapping. */
export function classifyRows(
  parsed: ParsedCsv,
  mapping: Record<string, CrmField>,
): ClassifiedRow[] {
  const fieldIndex = (field: CrmField) =>
    parsed.headers.findIndex((h) => mapping[h] === field);

  const iName = fieldIndex("name");
  const iPhone = fieldIndex("phone");
  const iDob = fieldIndex("dob");
  const iRef = fieldIndex("reference");
  const iRenewal = fieldIndex("renewal");

  return parsed.rows.map((cells, index) => {
    const name = iName >= 0 ? (cells[iName] ?? "") : "";
    const phone = iPhone >= 0 ? (cells[iPhone] ?? "") : "";
    const dob = iDob >= 0 ? (cells[iDob] ?? "") : "";
    const reference = iRef >= 0 ? (cells[iRef] ?? "") : "";
    const renewal = iRenewal >= 0 ? (cells[iRenewal] ?? "") : "";

    let category: RowCategory = "new";
    let matchName: string | undefined;
    let error: string | undefined;

    if (!phone.trim()) {
      category = "error";
      error = "Missing phone number";
    } else if (!name.trim()) {
      category = "error";
      error = "Missing name";
    } else {
      const match = clients.find((c) => lastTen(c.phone) === lastTen(phone));
      if (match) {
        matchName = match.name;
        category =
          match.name.toLowerCase().trim() === name.toLowerCase().trim()
            ? "existing"
            : "conflict";
      }
    }

    return {
      index,
      cells,
      name,
      phone,
      dob,
      reference,
      renewal,
      category,
      matchName,
      error,
    };
  });
}
