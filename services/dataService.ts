
import { OLT, SearchResult } from '../types';

class OltDataService {
  private olts: OLT[] = [];
  private catIdIndex: Map<string, string> = new Map(); // catId -> oltInternalId

  async initializeData(jsonData: any[]): Promise<OLT[]> {
    this.olts = jsonData.map((item, index) => ({
      ...item,
      id: `olt-${index}` // Assign stable internal ID
    })).filter(olt => olt.DV_lat !== null && olt.DV_lng !== null);

    // Build inverted index for high-performance search (< 100ms)
    console.time('IndexBuilding');
    this.olts.forEach(olt => {
      if (olt.cat_ids) {
        const ids = olt.cat_ids.split(/[;,]/).map((id: string) => id.trim());
        ids.forEach((id: string) => {
          if (id) this.catIdIndex.set(id.toLowerCase(), olt.id);
        });
      }
    });
    console.timeEnd('IndexBuilding');

    return this.olts;
  }

  async searchByCatId(query: string): Promise<SearchResult | null> {
    const startTime = performance.now();
    const oltId = this.catIdIndex.get(query.toLowerCase());
    
    if (!oltId) return null;
    
    const olt = this.olts.find(o => o.id === oltId);
    const duration = performance.now() - startTime;
    console.log(`Search completed in ${duration.toFixed(2)}ms`);
    
    return olt ? { olt, catId: query } : null;
  }

  getAutocompleteOptions(query: string, limit = 10): string[] {
    if (!query || query.length < 2) return [];
    const normalizedQuery = query.toLowerCase();
    const results: string[] = [];
    
    for (const [catId] of this.catIdIndex) {
      if (catId.includes(normalizedQuery)) {
        results.push(catId.toUpperCase());
        if (results.length >= limit) break;
      }
    }
    return results;
  }
}

export const dataService = new OltDataService();
