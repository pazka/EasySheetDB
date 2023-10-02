import { config } from "https://deno.land/x/dotenv/mod.ts";

class DbFetcher {
  private sheetId: string;
  private sheetNameExclusions: string[];
  private apiKey: string;
  private baseUrl: string;

  constructor(sheetId: string, sheetNameExclusions: string[]) {
    this.apiKey = config().API_KEY;
    this.baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/`;
    this.sheetId = sheetId;
    this.sheetNameExclusions = sheetNameExclusions;
  }

  async getSheetNames(): Promise<string[]> {
    const url = `${this.baseUrl}${this.sheetId}?key=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const sheets = data.sheets;
    const sheetNames = sheets.map((sheet: any) => sheet.properties.title);
    return sheetNames.filter((name: string) =>
      !this.sheetNameExclusions.includes(name)
    );
  }

  async getSheetData(sheetName: string): Promise<any[]> {
    const url =
      `${this.baseUrl}${this.sheetId}/values/${sheetName}?key=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values;
  }
}
