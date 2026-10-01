import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fetchRealBusinessListings, auditWebsite } from './server/scraper.js';

// Custom Vite plugin providing real backend lead scraper and audit API
function leadScraperApiPlugin() {
  return {
    name: 'lead-scraper-api',
    configureServer(server) {
      server.middlewares.use('/api/leads', async (req, res) => {
        try {
          const urlObj = new URL(req.url, 'http://localhost');
          const city = urlObj.searchParams.get('city') || 'Kochi';
          const keyword = urlObj.searchParams.get('keyword') || 'Restaurants';

          const rawLeads = await fetchRealBusinessListings(city, keyword);
          const results = [];

          // Perform real technical audit for each real lead
          for (const lead of rawLeads) {
            const audit = await auditWebsite(lead.website);
            results.push({ ...lead, audit });
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ 
            success: true, 
            isRealData: true, 
            city, 
            keyword, 
            total: results.length, 
            data: results 
          }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: error.message }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    leadScraperApiPlugin(),
  ],
});
