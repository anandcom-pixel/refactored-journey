/**
 * Local Client & Business Lead Scraper & Website Auditor
 * Standalone Node.js CLI script & utility
 * 
 * Usage:
 *   node server/scraper.js "Kochi" "Restaurants" [--export]
 */

import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';

// Technical URL Auditor using native Node http/https
export async function auditWebsite(urlStr) {
  if (!urlStr || urlStr === 'None' || urlStr === 'N/A') {
    return {
      status: 'No Website',
      statusCode: null,
      responseTimeMs: 0,
      hasSsl: false,
      opportunity: 'High - Needs Website Creation',
      isHealthy: false,
    };
  }

  const startTime = Date.now();
  let normalizedUrl = urlStr;
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  return new Promise((resolve) => {
    try {
      const parsed = new URL(normalizedUrl);
      const isHttps = parsed.protocol === 'https:';
      const client = isHttps ? https : http;

      const req = client.request(
        parsed,
        {
          method: 'HEAD',
          timeout: 4000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LeadAudit/1.0',
          },
        },
        (res) => {
          const duration = Date.now() - startTime;
          const code = res.statusCode || 200;
          const isHealthy = code >= 200 && code < 400;

          let opportunity = 'Low - Active Site';
          if (!isHttps) {
            opportunity = 'Medium - Missing SSL Certificate';
          } else if (duration > 1000) {
            opportunity = 'Medium - Slow Response Time (>1s)';
          } else if (code >= 400) {
            opportunity = 'High - Broken Link / Server Error';
          }

          resolve({
            status: `${code} ${res.statusMessage || 'OK'}`,
            statusCode: code,
            responseTimeMs: duration,
            hasSsl: isHttps,
            opportunity,
            isHealthy,
          });
        }
      );

      req.on('timeout', () => {
        req.destroy();
        resolve({
          status: 'Timeout (>4000ms)',
          statusCode: 408,
          responseTimeMs: 4000,
          hasSsl: normalizedUrl.startsWith('https:'),
          opportunity: 'High - Website Unresponsive / Server Down',
          isHealthy: false,
        });
      });

      req.on('error', (err) => {
        resolve({
          status: `Unreachable (${err.code || 'ERR'})`,
          statusCode: 503,
          responseTimeMs: Date.now() - startTime,
          hasSsl: normalizedUrl.startsWith('https:'),
          opportunity: 'High - Domain Inactive / Needs Hosting',
          isHealthy: false,
        });
      });

      req.end();
    } catch {
      resolve({
        status: 'Invalid URL Format',
        statusCode: 400,
        responseTimeMs: 0,
        hasSsl: false,
        opportunity: 'High - Invalid Web Presence',
        isHealthy: false,
      });
    }
  });
}

// Public listing generator / mock scraper for any City & Industry
export function generateLocalLeads(city, industry) {
  const cleanCity = city.trim();
  const cleanInd = industry.trim();

  // Industry name prefixes & suffixes
  const prefixes = [
    'The Grand', 'Royal', 'Prime', 'Apex', 'Urban', 'Metro', 'Elite', 
    'Heritage', 'Classic', 'Southern', 'Spice Coast', 'Imperial', 'Golden'
  ];
  const middleNames = [
    cleanInd.replace(/s$/i, ''),
    'Care', 'Hub', 'Central', 'Plaza', 'Point', 'Studio', 'Works', 'Craft'
  ];
  const streets = [
    'MG Road', 'Marine Drive', 'Kaloor', 'Palarivattom', 'Edappally', 
    'Panampilly Nagar', 'Fort Road', 'Vyttila', 'Infopark Expressway', 'Civil Line Road'
  ];

  const leads = [];
  const count = 10;

  for (let i = 0; i < count; i++) {
    const prefix = prefixes[i % prefixes.length];
    const mid = middleNames[i % middleNames.length];
    const name = `${prefix} ${mid} ${i > 4 ? cleanCity : ''}`.trim();
    const street = streets[i % streets.length];
    const address = `${100 + i * 14}, ${street}, ${cleanCity}`;
    const phone = `+91 ${98400 + i * 111} ${12340 + i * 23}`;
    const rating = (4.0 + (i % 10) * 0.1).toFixed(1);
    const reviews = 45 + i * 28;

    // Varied web presence for realistic auditing
    let website = '';
    if (i % 4 === 1) {
      website = 'None'; // Opportunity lead
    } else if (i % 4 === 2) {
      website = `http://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`; // Non-SSL lead
    } else if (i % 4 === 3) {
      website = `https://httpstat.us/404`; // Broken link
    } else {
      website = `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${cleanCity.toLowerCase()}.com`;
    }

    leads.push({
      id: `lead-${Date.now()}-${i}`,
      name,
      industry: cleanInd,
      city: cleanCity,
      address,
      phone,
      rating,
      reviews,
      website: website === 'None' ? '' : website,
    });
  }

  return leads;
}

// Convert leads array to CSV format
export function convertToCsv(leadsWithAudits) {
  const headers = [
    'Business Name',
    'Industry',
    'City',
    'Phone',
    'Address',
    'Rating',
    'Website',
    'Audit Status',
    'Response Time (ms)',
    'SSL Secured',
    'Sales Opportunity',
  ];

  const rows = leadsWithAudits.map((item) => [
    `"${item.name.replace(/"/g, '""')}"`,
    `"${item.industry.replace(/"/g, '""')}"`,
    `"${item.city.replace(/"/g, '""')}"`,
    `"${item.phone.replace(/"/g, '""')}"`,
    `"${item.address.replace(/"/g, '""')}"`,
    item.rating,
    `"${item.website || 'N/A'}"`,
    `"${item.audit?.status || 'Pending'}"`,
    item.audit?.responseTimeMs || 0,
    item.audit?.hasSsl ? 'Yes' : 'No',
    `"${item.audit?.opportunity || 'N/A'}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

// CLI runner
if (process.argv[1] && process.argv[1].endsWith('scraper.js')) {
  const cityArg = process.argv[2] || 'Kochi';
  const industryArg = process.argv[3] || 'Restaurants';
  const shouldExport = process.argv.includes('--export');

  console.log(`\n🔍 Searching local leads for: [${industryArg}] in [${cityArg}]...\n`);

  const rawLeads = generateLocalLeads(cityArg, industryArg);

  (async () => {
    const results = [];
    for (const lead of rawLeads) {
      process.stdout.write(`Auditing: ${lead.name} (${lead.website || 'No website'})... `);
      const audit = await auditWebsite(lead.website);
      console.log(`-> ${audit.status} [${audit.opportunity}]`);
      results.push({ ...lead, audit });
    }

    console.log(`\n✅ Scanned ${results.length} leads successfully!`);

    if (shouldExport) {
      const csvData = convertToCsv(results);
      const fileName = `leads-${cityArg.toLowerCase()}-${industryArg.toLowerCase()}.csv`;
      fs.writeFileSync(path.join(process.cwd(), fileName), csvData, 'utf-8');
      console.log(`📁 Exported results to: ${fileName}`);
    }
  })();
}
