import express from 'express';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  let agency = {
    name: 'Bizzgraph',
    subtitle: 'Your Business Grower',
    admin_name: 'Rahmatullah Sakib',
    meta_access_token: 'EAABkP28...v19.0_bizzgraph_demo_token',
    logo_url: '',
    currency: '$'
  };

  let adAccounts = [
    { id: 1, account_name: 'Bizzgraph-Meta-01', platform: 'Meta Ads', status: 'Active' },
    { id: 2, account_name: 'Bizzgraph-Meta-02', platform: 'Meta Ads', status: 'Active' },
    { id: 3, account_name: 'Bizzgraph-Google-Scale', platform: 'Google Ads', status: 'Active' },
    { id: 4, account_name: 'Bizzgraph-TikTok-Global', platform: 'TikTok', status: 'Active' },
    { id: 5, account_name: 'Bizzgraph-Meta-Enterprise', platform: 'Meta Ads', status: 'Active' }
  ];

  let users = [
    { id: 1, name: 'Rahmatullah Sakib', role: 'Admin', email: 'rahmatullah.sbmc.27@gmail.com' },
    { id: 2, name: 'Rafiqul Islam', role: 'Sub-Admin', email: 'rafiqul@bizzgraph.com' },
    { id: 3, name: 'Nusrat Jahan', role: 'Media Buyer', email: 'nusrat@bizzgraph.com' },
    { id: 4, name: 'Tanjila Akter', role: 'Marketer', email: 'tanjila@bizzgraph.com' },
    { id: 5, name: 'Tanvir Ahmed', role: 'Marketer', email: 'tanvir@bizzgraph.com' }
  ];

  let notifications = [
    { id: 1, text: 'Ad account updated to Bizzgraph-Meta-01 for Vortex Media Labs', time: '10m ago', unread: true },
    { id: 2, text: 'Meta Campaign ID #23850192849102 synced for Aurelia Organics', time: '1h ago', unread: true },
    { id: 3, text: 'Spend alert: PulseFit Athletics reached 70% of total budget', time: '3h ago', unread: true },
    { id: 4, text: 'New Quick Note saved for Zenith FinTech: "Targeting scaled"', time: '5h ago', unread: false }
  ];

  let campaigns = [
    {
      id: 1,
      unique_id: '4921',
      client_name: 'Vortex Media Labs',
      meta_campaign_id: '23850192849102',
      total_budget: 1800.0,
      daily_budget: 60.0,
      total_days: 30,
      category: 'Tech & SaaS',
      direction: 'B2B Demo Signups & Lookalike 1%',
      status: 'Active',
      total_spent: 980.40,
      prev_spent: 0.0,
      current_spent: 980.40,
      current_ad_account: 'Bizzgraph-Meta-01',
      prev_ad_account: '',
      start_date: '2026-04-26',
      end_date: '2026-05-26',
      marketer_name: 'Rafiqul Islam',
      quick_notes: 'CPL reduced to $4.20 after creative refresh.',
      magic_token: 'm-4921-a1'
    },
    {
      id: 2,
      unique_id: '8142',
      client_name: 'Aurelia Organics',
      meta_campaign_id: '23850938201944',
      total_budget: 2800.0,
      daily_budget: 93.3,
      total_days: 30,
      category: 'E-commerce',
      direction: 'Advantage+ Catalog Sales Carousel',
      status: 'Active',
      total_spent: 1540.75,
      prev_spent: 0.0,
      current_spent: 1540.75,
      current_ad_account: 'Bizzgraph-Meta-02',
      prev_ad_account: '',
      start_date: '2026-04-23',
      end_date: '2026-05-23',
      marketer_name: 'Nusrat Jahan',
      quick_notes: 'High ROAS 4.3x on skin hydration kit bundles.',
      magic_token: 'm-8142-b2'
    },
    {
      id: 3,
      unique_id: '3760',
      client_name: 'PulseFit Athletics',
      meta_campaign_id: '23849102948110',
      total_budget: 1400.0,
      daily_budget: 46.7,
      total_days: 30,
      category: 'Fitness',
      direction: 'Gym Membership Instant Forms',
      status: 'Paused',
      total_spent: 610.20,
      prev_spent: 220.0,
      current_spent: 390.20,
      current_ad_account: 'Bizzgraph-Meta-01',
      prev_ad_account: 'Bizzgraph-Meta-02',
      start_date: '2026-04-20',
      end_date: '2026-05-20',
      marketer_name: 'Tanjila Akter',
      quick_notes: 'Awaiting revised spring promotion offer copy.',
      magic_token: 'm-3760-c3'
    },
    {
      id: 4,
      unique_id: '6219',
      client_name: 'Zenith FinTech',
      meta_campaign_id: '23851029384756',
      total_budget: 3200.0,
      daily_budget: 106.7,
      total_days: 30,
      category: 'Finance',
      direction: 'App Install & KYC Registration Flow',
      status: 'Active',
      total_spent: 1980.50,
      prev_spent: 0.0,
      current_spent: 1980.50,
      current_ad_account: 'Bizzgraph-Meta-Enterprise',
      prev_ad_account: '',
      start_date: '2026-04-18',
      end_date: '2026-05-18',
      marketer_name: 'Rahmatullah Sakib',
      quick_notes: 'Compliance approved new investment disclaimer.',
      magic_token: 'm-6219-d4'
    },
    {
      id: 5,
      unique_id: '9504',
      client_name: 'Omnia Commerce',
      meta_campaign_id: '23848192039485',
      total_budget: 1600.0,
      daily_budget: 53.3,
      total_days: 30,
      category: 'E-commerce',
      direction: 'TikTok Spark Ads & Short Video Reels',
      status: 'Active',
      total_spent: 890.30,
      prev_spent: 0.0,
      current_spent: 890.30,
      current_ad_account: 'Bizzgraph-TikTok-Global',
      prev_ad_account: '',
      start_date: '2026-04-16',
      end_date: '2026-05-16',
      marketer_name: 'Rafiqul Islam',
      quick_notes: 'Influencer collaboration clip generated 85k views.',
      magic_token: 'm-9504-e5'
    },
    {
      id: 6,
      unique_id: '2835',
      client_name: 'Solis Solar Energy',
      meta_campaign_id: '23847291039481',
      total_budget: 2500.0,
      daily_budget: 83.3,
      total_days: 30,
      category: 'Energy & Home',
      direction: 'Residential Solar Quote Request Form',
      status: 'Rejected',
      total_spent: 0.0,
      prev_spent: 0.0,
      current_spent: 0.0,
      current_ad_account: 'Bizzgraph-Google-Scale',
      prev_ad_account: '',
      start_date: '2026-04-14',
      end_date: '2026-05-14',
      marketer_name: 'Tanvir Ahmed',
      quick_notes: 'Ad creative text flag. Replaced with certified copy.',
      magic_token: 'm-2835-f6'
    },
    {
      id: 7,
      unique_id: '7491',
      client_name: 'NexaCore Robotics',
      meta_campaign_id: '23851928471920',
      total_budget: 2100.0,
      daily_budget: 70.0,
      total_days: 30,
      category: 'Tech & SaaS',
      direction: 'Enterprise Warehouse Automation Inquiries',
      status: 'Active',
      total_spent: 1220.45,
      prev_spent: 0.0,
      current_spent: 1220.45,
      current_ad_account: 'Bizzgraph-Meta-01',
      prev_ad_account: '',
      start_date: '2026-04-12',
      end_date: '2026-05-12',
      marketer_name: 'Rahmatullah Sakib',
      quick_notes: 'Targeting Supply Chain Directors in DACH region.',
      magic_token: 'm-7491-g7'
    },
    {
      id: 8,
      unique_id: '1953',
      client_name: 'Bloom Dental Care',
      meta_campaign_id: '23850192847561',
      total_budget: 1100.0,
      daily_budget: 36.7,
      total_days: 30,
      category: 'Healthcare',
      direction: 'Local Teeth Whitening Special Offer Leads',
      status: 'Active',
      total_spent: 590.80,
      prev_spent: 0.0,
      current_spent: 590.80,
      current_ad_account: 'Bizzgraph-Meta-02',
      prev_ad_account: '',
      start_date: '2026-04-10',
      end_date: '2026-05-10',
      marketer_name: 'Ayesha Siddiqua',
      quick_notes: '24 direct consultations booked this week.',
      magic_token: 'm-1953-h8'
    },
    {
      id: 9,
      unique_id: '5827',
      client_name: 'Horizon Logistics',
      meta_campaign_id: '23849182049182',
      total_budget: 2600.0,
      daily_budget: 86.7,
      total_days: 30,
      category: 'Transportation',
      direction: 'Freight Rate Calculator Web Traffic',
      status: 'Active',
      total_spent: 1840.30,
      prev_spent: 0.0,
      current_spent: 1840.30,
      current_ad_account: 'Bizzgraph-Google-Scale',
      prev_ad_account: '',
      start_date: '2026-04-08',
      end_date: '2026-05-08',
      marketer_name: 'Tanjila Akter',
      quick_notes: 'High conversion rate on coastal maritime corridors.',
      magic_token: 'm-5827-i9'
    },
    {
      id: 10,
      unique_id: '4362',
      client_name: 'UrbanKicks Footwear',
      meta_campaign_id: '23852019485721',
      total_budget: 1750.0,
      daily_budget: 58.3,
      total_days: 30,
      category: 'Fashion',
      direction: 'Sneaker Drop Retargeting & Dynamic Ads',
      status: 'Paused',
      total_spent: 810.20,
      prev_spent: 340.0,
      current_spent: 470.20,
      current_ad_account: 'Bizzgraph-Meta-01',
      prev_ad_account: 'Bizzgraph-Meta-02',
      start_date: '2026-04-06',
      end_date: '2026-05-06',
      marketer_name: 'Nusrat Jahan',
      quick_notes: 'Paused awaiting batch delivery at warehouse.',
      magic_token: 'm-4362-j10'
    },
    {
      id: 11,
      unique_id: '8716',
      client_name: 'Artisan Roast Co.',
      meta_campaign_id: '23851029485712',
      total_budget: 2200.0,
      daily_budget: 73.3,
      total_days: 30,
      category: 'Food & Beverage',
      direction: 'Specialty Coffee Subscription Sampling',
      status: 'Active',
      total_spent: 1610.60,
      prev_spent: 0.0,
      current_spent: 1610.60,
      current_ad_account: 'Bizzgraph-Meta-02',
      prev_ad_account: '',
      start_date: '2026-04-04',
      end_date: '2026-05-04',
      marketer_name: 'Rafiqul Islam',
      quick_notes: 'Subscription renewal rate above 78%.',
      magic_token: 'm-8716-k11'
    },
    {
      id: 12,
      unique_id: '6108',
      client_name: 'CloudVista Cyber',
      meta_campaign_id: '23847192039472',
      total_budget: 2000.0,
      daily_budget: 66.7,
      total_days: 30,
      category: 'Tech & SaaS',
      direction: 'SOC-2 Compliance Checklist Whitepaper',
      status: 'Completed',
      total_spent: 2000.0,
      prev_spent: 0.0,
      current_spent: 2000.0,
      current_ad_account: 'Bizzgraph-Google-Scale',
      prev_ad_account: '',
      start_date: '2026-04-01',
      end_date: '2026-05-01',
      marketer_name: 'Rahmatullah Sakib',
      quick_notes: '100% budget reached. Client requested 2x renewal.',
      magic_token: 'm-6108-l12'
    }
  ];

  // Bootstrap Endpoint
  app.get('/api/bootstrap', (_req, res) => {
    res.json({
      agency,
      users,
      ad_accounts: adAccounts,
      campaigns,
      notifications
    });
  });

  // Agency Settings & Meta Token
  app.get('/api/agency', (_req, res) => res.json(agency));
  app.post('/api/agency', (req, res) => {
    const { name, subtitle, admin_name, meta_access_token, logo_url } = req.body;
    if (name) agency.name = name;
    if (subtitle) agency.subtitle = subtitle;
    if (admin_name) agency.admin_name = admin_name;
    if (meta_access_token !== undefined) agency.meta_access_token = meta_access_token;
    if (logo_url !== undefined) agency.logo_url = logo_url;
    res.json(agency);
  });

  // Notifications API
  app.get('/api/notifications', (_req, res) => res.json(notifications));
  app.post('/api/notifications/clear', (_req, res) => {
    notifications = notifications.map(n => ({ ...n, unread: false }));
    res.json({ success: true, notifications });
  });

  // Campaigns API
  app.get('/api/campaigns', (_req, res) => res.json(campaigns));
  app.post('/api/campaigns', (req, res) => {
    const autoId = String(Math.floor(1000 + Math.random() * 9000));
    const days = Number(req.body.total_days) || 30;
    const sDate = new Date().toISOString().slice(0, 10);
    const eDate = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString().slice(0, 10);
    const tBudget = Number(req.body.total_budget) || 1500;
    const dBudget = Number(req.body.daily_budget) || (tBudget / days);

    const newCamp = {
      id: campaigns.length ? Math.max(...campaigns.map(c => c.id)) + 1 : 1,
      unique_id: autoId,
      client_name: req.body.client_name || 'New Client',
      meta_campaign_id: req.body.meta_campaign_id || `2385${autoId}${Math.floor(100000 + Math.random() * 900000)}`,
      total_budget: tBudget,
      daily_budget: Number(dBudget.toFixed(2)),
      total_days: days,
      category: req.body.category || 'Tech & SaaS',
      direction: req.body.direction || 'Targeting Broad Conversion',
      status: 'Active',
      total_spent: 0.0,
      prev_spent: 0.0,
      current_spent: 0.0,
      current_ad_account: req.body.current_ad_account || 'Bizzgraph-Meta-01',
      prev_ad_account: '',
      start_date: sDate,
      end_date: eDate,
      marketer_name: req.body.marketer_name || 'Rahmatullah Sakib',
      quick_notes: req.body.quick_notes || 'Campaign initialized in Bizzgraph.',
      magic_token: `m-${autoId}`
    };
    campaigns.unshift(newCamp);

    notifications.unshift({
      id: Date.now(),
      text: `Created new campaign for ${newCamp.client_name} (#${newCamp.unique_id})`,
      time: 'Just now',
      unread: true
    });

    res.status(201).json(newCamp);
  });

  app.put('/api/campaigns/:id', (req, res) => {
    const cid = Number(req.params.id);
    const idx = campaigns.findIndex(c => c.id === cid);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });

    const c = campaigns[idx];
    const prev_spent = req.body.prev_spent !== undefined ? Number(req.body.prev_spent) : c.prev_spent;
    let total_spent = c.total_spent;
    let current_spent = c.current_spent;

    if (req.body.current_spent !== undefined) {
      current_spent = Number(req.body.current_spent);
      total_spent = prev_spent + current_spent;
    } else if (req.body.total_spent !== undefined) {
      total_spent = Number(req.body.total_spent);
      current_spent = Math.max(0, total_spent - prev_spent);
    }

    const prevAcc = c.current_ad_account;
    const newAcc = req.body.current_ad_account || c.current_ad_account;

    campaigns[idx] = {
      ...c,
      ...req.body,
      id: cid,
      total_spent,
      prev_spent,
      current_spent,
      current_ad_account: newAcc,
      meta_campaign_id: req.body.meta_campaign_id !== undefined ? req.body.meta_campaign_id : c.meta_campaign_id
    };

    if (prevAcc !== newAcc) {
      notifications.unshift({
        id: Date.now(),
        text: `Ad account updated to ${newAcc} for ${c.client_name}`,
        time: 'Just now',
        unread: true
      });
    }

    res.json(campaigns[idx]);
  });

  // Quick Note endpoint
  app.post('/api/campaigns/:id/quick-note', (req, res) => {
    const cid = Number(req.params.id);
    const idx = campaigns.findIndex(c => c.id === cid);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });

    const note = (req.body.note || '').trim();
    if (note) {
      campaigns[idx].quick_notes = note;
      notifications.unshift({
        id: Date.now(),
        text: `Quick note added for ${campaigns[idx].client_name}: "${note.slice(0, 30)}..."`,
        time: 'Just now',
        unread: true
      });
    }
    res.json(campaigns[idx]);
  });

  // Meta Graph API preparation / simulated sync
  app.post('/api/campaigns/:id/sync-meta', (req, res) => {
    const cid = Number(req.params.id);
    const idx = campaigns.findIndex(c => c.id === cid);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });

    const camp = campaigns[idx];
    if (!agency.meta_access_token) {
      return res.status(400).json({ error: 'Meta API Access Token is not configured in Agency Settings.' });
    }

    // Simulate real-time fetch from Meta Graph API Insights
    const simulatedSpendIncrement = Math.round((Math.random() * 25 + 5) * 100) / 100;
    const newTotal = Math.min(camp.total_budget, Math.round((camp.total_spent + simulatedSpendIncrement) * 100) / 100);
    camp.total_spent = newTotal;
    camp.current_spent = Math.max(0, newTotal - camp.prev_spent);

    notifications.unshift({
      id: Date.now(),
      text: `Meta Graph API Insights synced for ${camp.client_name} (#${camp.meta_campaign_id})`,
      time: 'Just now',
      unread: true
    });

    res.json({
      success: true,
      message: `Synced with Meta Graph API for Campaign ID ${camp.meta_campaign_id}`,
      campaign: camp
    });
  });

  app.delete('/api/campaigns/:id', (req, res) => {
    const cid = Number(req.params.id);
    campaigns = campaigns.filter(c => c.id !== cid);
    res.json({ success: true });
  });

  // Ad Accounts
  app.get('/api/ad-accounts', (_req, res) => res.json(adAccounts));
  app.post('/api/ad-accounts', (req, res) => {
    const accName = (req.body.account_name || '').trim();
    if (!accName) return res.status(400).json({ error: 'Account name required' });
    const newAcc = {
      id: adAccounts.length + 1,
      account_name: accName,
      platform: req.body.platform || 'Meta Ads',
      status: req.body.status || 'Active'
    };
    adAccounts.push(newAcc);
    res.status(201).json(newAcc);
  });

  // Users
  app.get('/api/users', (_req, res) => res.json(users));
  app.post('/api/users', (req, res) => {
    const uName = (req.body.name || '').trim();
    if (!uName) return res.status(400).json({ error: 'User name required' });
    const newUser = {
      id: users.length + 1,
      name: uName,
      role: req.body.role || 'Marketer',
      email: req.body.email || ''
    };
    users.push(newUser);
    res.status(201).json(newUser);
  });

  // Magic Link Read-Only View
  app.get('/api/magic/:unique_id', (req, res) => {
    const camp = campaigns.find(c => c.unique_id === req.params.unique_id);
    if (!camp) return res.status(404).json({ error: 'Campaign not found' });
    res.json({
      unique_id: camp.unique_id,
      client_name: camp.client_name,
      meta_campaign_id: camp.meta_campaign_id,
      status: camp.status,
      total_spent: camp.total_spent,
      total_budget: camp.total_budget,
      daily_budget: camp.daily_budget,
      start_date: camp.start_date,
      end_date: camp.end_date,
      category: camp.category,
      direction: camp.direction,
      marketer_name: camp.marketer_name,
      current_ad_account: camp.current_ad_account,
      quick_notes: camp.quick_notes
    });
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bizzgraph SaaS Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
