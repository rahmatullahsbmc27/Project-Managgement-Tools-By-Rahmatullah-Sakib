"""
Bizzgraph - Ad Management SaaS (Phase 1)
Agency: "Bizzgraph" | Slogan: "Your Business Grower" | Admin: "Rahmatullah Sakib"
Roles: Admin, Sub-Admin, Media Buyer, Marketer
Tech Stack: Python Flask, SQLite, Vanilla HTML/CSS/JS
"""
import sqlite3, random, os
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='.', static_url_path='')
DATABASE = 'ad_agency.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as c:
        c.execute('''CREATE TABLE IF NOT EXISTS agency (
            id INTEGER PRIMARY KEY, name TEXT, subtitle TEXT, admin_name TEXT,
            meta_access_token TEXT, logo_url TEXT, currency TEXT)''')
        c.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, role TEXT, email TEXT)''')
        c.execute('''CREATE TABLE IF NOT EXISTS ad_accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT, account_name TEXT UNIQUE, platform TEXT, status TEXT)''')
        c.execute('''CREATE TABLE IF NOT EXISTS campaigns (
            id INTEGER PRIMARY KEY AUTOINCREMENT, unique_id TEXT UNIQUE, client_name TEXT,
            meta_campaign_id TEXT, total_budget REAL, daily_budget REAL, total_days INTEGER,
            category TEXT, direction TEXT, status TEXT, total_spent REAL, prev_spent REAL,
            current_spent REAL, current_ad_account TEXT, prev_ad_account TEXT, start_date TEXT,
            end_date TEXT, marketer_name TEXT, quick_notes TEXT, magic_token TEXT UNIQUE)''')
        c.execute('''CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, time TEXT, unread INTEGER DEFAULT 1)''')

        if not c.execute('SELECT COUNT(*) FROM agency').fetchone()[0]:
            c.execute('INSERT INTO agency VALUES (1,?,?,?,?,?,?)',
                      ('Bizzgraph', 'Your Business Grower', 'Rahmatullah Sakib', 'EAABkP28_bizzgraph_token_v19', '', '$'))

        if not c.execute('SELECT COUNT(*) FROM users').fetchone()[0]:
            c.executemany('INSERT INTO users (name, role, email) VALUES (?,?,?)', [
                ('Rahmatullah Sakib', 'Admin', 'rahmatullah.sbmc.27@gmail.com'),
                ('Rafiqul Islam', 'Sub-Admin', 'rafiqul@bizzgraph.com'),
                ('Nusrat Jahan', 'Media Buyer', 'nusrat@bizzgraph.com'),
                ('Tanjila Akter', 'Marketer', 'tanjila@bizzgraph.com'),
                ('Tanvir Ahmed', 'Marketer', 'tanvir@bizzgraph.com')
            ])

        if not c.execute('SELECT COUNT(*) FROM ad_accounts').fetchone()[0]:
            c.executemany('INSERT INTO ad_accounts (account_name, platform, status) VALUES (?,?,?)', [
                ('Bizzgraph-Meta-01', 'Meta Ads', 'Active'),
                ('Bizzgraph-Meta-02', 'Meta Ads', 'Active'),
                ('Bizzgraph-Google-Scale', 'Google Ads', 'Active'),
                ('Bizzgraph-TikTok-Global', 'TikTok', 'Active')
            ])

        if not c.execute('SELECT COUNT(*) FROM campaigns').fetchone()[0]:
            camps = [
                ('4921', 'Vortex Media Labs', '23850192849102', 1800.0, 60.0, 30, 'Tech & SaaS', 'B2B Demo Signups', 'Active', 980.40, 0.0, 980.40, 'Bizzgraph-Meta-01', '', '2026-04-26', '2026-05-26', 'Tanjila Akter', 'CPL dropped to $4.20 after creative refresh', 'm-4921'),
                ('8142', 'Aurelia Organics', '23850938201944', 2800.0, 93.3, 30, 'E-commerce', 'Advantage+ Catalog Sales', 'Active', 1540.75, 0.0, 1540.75, 'Bizzgraph-Meta-02', '', '2026-04-23', '2026-05-23', 'Nusrat Jahan', 'Organic skincare line push (ROAS 4.3x)', 'm-8142'),
                ('3760', 'PulseFit Athletics', '23849102948110', 1400.0, 46.7, 30, 'Fitness', 'Membership Lead Generation', 'Paused', 610.20, 220.0, 390.20, 'Bizzgraph-Meta-01', 'Bizzgraph-Meta-02', '2026-04-20', '2026-05-20', 'Tanvir Ahmed', 'Client revising spring discount copy', 'm-3760'),
                ('6219', 'Zenith FinTech', '23851029384756', 3200.0, 106.7, 30, 'Finance', 'Mobile App Install Flow', 'Active', 1980.50, 0.0, 1980.50, 'Bizzgraph-Google-Scale', '', '2026-04-18', '2026-05-18', 'Rahmatullah Sakib', 'Compliance approved disclaimer update', 'm-6219'),
                ('9504', 'Omnia Commerce', '23848192039485', 1600.0, 53.3, 30, 'E-commerce', 'TikTok Spark Ads Viral Video', 'Active', 890.30, 0.0, 890.30, 'Bizzgraph-TikTok-Global', '', '2026-04-16', '2026-05-16', 'Rafiqul Islam', 'Generated 85k views in 48 hours', 'm-9504'),
                ('2835', 'Solis Solar Energy', '23847291039481', 2500.0, 83.3, 30, 'Energy & Home', 'Quote Calculator Submissions', 'Rejected', 0.0, 0.0, 0.0, 'Bizzgraph-Google-Scale', '', '2026-04-14', '2026-05-14', 'Tanvir Ahmed', 'Logo trademark issue flagged by Meta', 'm-2835'),
                ('7491', 'NexaCore Robotics', '23851928471920', 2100.0, 70.0, 30, 'Tech & SaaS', 'Enterprise Warehouse Leads', 'Active', 1220.45, 0.0, 1220.45, 'Bizzgraph-Meta-01', '', '2026-04-12', '2026-05-12', 'Tanjila Akter', 'High-intent B2B inquiries generated', 'm-7491'),
                ('1953', 'Bloom Dental Care', '23850192847561', 1100.0, 36.7, 30, 'Healthcare', 'Local Whitening Discount Leads', 'Active', 590.80, 0.0, 590.80, 'Bizzgraph-Meta-02', '', '2026-04-10', '2026-05-10', 'Nusrat Jahan', '24 clinic appointments scheduled', 'm-1953')
            ]
            c.executemany('''INSERT INTO campaigns VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)''', camps)

        if not c.execute('SELECT COUNT(*) FROM notifications').fetchone()[0]:
            c.executemany('INSERT INTO notifications (text, time, unread) VALUES (?, ?, ?)', [
                ('Ad account updated for Vortex Media Labs', '10m ago', 1),
                ('Meta Campaign ID synced for Aurelia Organics', '1h ago', 1),
                ('Spend alert: PulseFit Athletics reached 70% budget', '3h ago', 1),
                ('Quick note added for Zenith FinTech', '5h ago', 0)
            ])

init_db()

META_AUTH_ROLES = ['Admin', 'Sub-Admin', 'Media Buyer']

@app.route('/api/bootstrap')
def api_bootstrap():
    with get_db() as c:
        return jsonify({
            'agency': dict(c.execute('SELECT * FROM agency WHERE id=1').fetchone()),
            'users': [dict(r) for r in c.execute('SELECT * FROM users ORDER BY id ASC').fetchall()],
            'ad_accounts': [dict(r) for r in c.execute('SELECT * FROM ad_accounts ORDER BY id ASC').fetchall()],
            'campaigns': [dict(r) for r in c.execute('SELECT * FROM campaigns ORDER BY id DESC').fetchall()],
            'notifications': [dict(r) for r in c.execute('SELECT * FROM notifications ORDER BY id DESC LIMIT 15').fetchall()]
        })

@app.route('/api/agency', methods=['GET', 'POST'])
def api_agency():
    with get_db() as c:
        curr = dict(c.execute('SELECT * FROM agency WHERE id=1').fetchone())
        if request.method == 'POST':
            d = request.json or {}
            role = request.headers.get('X-User-Role') or d.get('active_role', 'Admin')
            token = curr.get('meta_access_token', '')
            if 'meta_access_token' in d:
                if role not in META_AUTH_ROLES:
                    return jsonify({'error': 'Unauthorized: Meta API restricted to Admin, Sub-Admin, and Media Buyer only.'}), 403
                token = d['meta_access_token']
            c.execute('UPDATE agency SET name=?, subtitle=?, admin_name=?, meta_access_token=?, logo_url=? WHERE id=1',
                      (d.get('name', curr['name']), d.get('subtitle', curr['subtitle']), d.get('admin_name', curr['admin_name']), token, d.get('logo_url', curr.get('logo_url', ''))))
        return jsonify(dict(c.execute('SELECT * FROM agency WHERE id=1').fetchone()))

@app.route('/api/campaigns', methods=['GET', 'POST'])
def api_campaigns():
    with get_db() as c:
        if request.method == 'POST':
            d = request.json or {}
            while True:
                uid = str(random.randint(1000, 9999))
                if not c.execute('SELECT id FROM campaigns WHERE unique_id=?', (uid,)).fetchone(): break
            days = int(d.get('total_days', 30))
            s_date = datetime.now().strftime('%Y-%m-%d')
            e_date = (datetime.now() + timedelta(days=days)).strftime('%Y-%m-%d')
            t_budget = float(d.get('total_budget', 1500.0))
            d_budget = float(d.get('daily_budget', t_budget / max(1, days)))
            meta_id = d.get('meta_campaign_id') or f"2385{uid}{random.randint(100000, 999999)}"
            client_name = d.get('client_name', 'New Client').strip() or 'New Client'

            c.execute('''INSERT INTO campaigns VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)''',
                      (uid, client_name, meta_id, t_budget, round(d_budget, 2), days,
                       d.get('category', 'Tech & SaaS'), d.get('direction', 'Targeting Broad Conversion'),
                       'Active', 0.0, 0.0, 0.0, d.get('current_ad_account', 'Bizzgraph-Meta-01'), '', s_date, e_date,
                       d.get('marketer_name', 'Rahmatullah Sakib'), d.get('quick_notes', 'Campaign initialized.'), f"m-{uid}"))
            new_id = c.execute('SELECT last_insert_rowid()').fetchone()[0]
            c.execute('INSERT INTO notifications (text, time, unread) VALUES (?, ?, 1)',
                      (f"New campaign created for {client_name} (#{uid})", 'Just now'))
            return jsonify(dict(c.execute('SELECT * FROM campaigns WHERE id=?', (new_id,)).fetchone())), 201
        return jsonify([dict(r) for r in c.execute('SELECT * FROM campaigns ORDER BY id DESC').fetchall()])

@app.route('/api/campaigns/<int:cid>', methods=['GET', 'PUT', 'DELETE'])
def api_campaign_item(cid):
    with get_db() as c:
        curr = c.execute('SELECT * FROM campaigns WHERE id=?', (cid,)).fetchone()
        if not curr: return jsonify({'error': 'Not found'}), 404
        if request.method == 'GET': return jsonify(dict(curr))
        if request.method == 'DELETE':
            c.execute('DELETE FROM campaigns WHERE id=?', (cid,))
            return jsonify({'success': True})
        d = request.json or {}
        prev_spent = float(d.get('prev_spent', curr['prev_spent']))
        total_spent = float(d.get('total_spent', curr['total_spent']))
        current_spent = max(0.0, total_spent - prev_spent)
        c.execute('''UPDATE campaigns SET client_name=?, status=?, total_budget=?, daily_budget=?, total_spent=?,
                     prev_spent=?, current_spent=?, current_ad_account=?, meta_campaign_id=?, category=?, direction=?,
                     marketer_name=?, quick_notes=? WHERE id=?''',
                  (d.get('client_name', curr['client_name']), d.get('status', curr['status']),
                   float(d.get('total_budget', curr['total_budget'])), float(d.get('daily_budget', curr['daily_budget'])),
                   total_spent, prev_spent, current_spent, d.get('current_ad_account', curr['current_ad_account']),
                   d.get('meta_campaign_id', curr['meta_campaign_id']), d.get('category', curr['category']),
                   d.get('direction', curr['direction']), d.get('marketer_name', curr['marketer_name']),
                   d.get('quick_notes', curr['quick_notes']), cid))
        return jsonify(dict(c.execute('SELECT * FROM campaigns WHERE id=?', (cid,)).fetchone()))

@app.route('/api/campaigns/<int:cid>/quick-note', methods=['POST'])
def api_quick_note(cid):
    with get_db() as c:
        curr = c.execute('SELECT * FROM campaigns WHERE id=?', (cid,)).fetchone()
        if not curr: return jsonify({'error': 'Not found'}), 404
        note = (request.json or {}).get('note', '').strip()
        if note:
            c.execute('UPDATE campaigns SET quick_notes=? WHERE id=?', (note, cid))
            c.execute('INSERT INTO notifications (text, time, unread) VALUES (?, ?, 1)',
                      (f"Note added for {curr['client_name']}: \"{note[:25]}...\"", 'Just now'))
        return jsonify(dict(c.execute('SELECT * FROM campaigns WHERE id=?', (cid,)).fetchone()))

@app.route('/api/notifications', methods=['GET'])
def api_notifications():
    with get_db() as c:
        return jsonify([dict(r) for r in c.execute('SELECT * FROM notifications ORDER BY id DESC LIMIT 20').fetchall()])

@app.route('/api/notifications/clear', methods=['POST'])
def api_clear_notifications():
    with get_db() as c:
        c.execute('UPDATE notifications SET unread=0')
        return jsonify({'success': True})

@app.route('/api/ad-accounts', methods=['GET', 'POST'])
def api_ad_accounts():
    with get_db() as c:
        if request.method == 'POST':
            d = request.json or {}
            acc = d.get('account_name', '').strip()
            if acc:
                c.execute('INSERT OR IGNORE INTO ad_accounts (account_name, platform, status) VALUES (?,?,?)',
                          (acc, d.get('platform', 'Meta Ads'), d.get('status', 'Active')))
        return jsonify([dict(r) for r in c.execute('SELECT * FROM ad_accounts ORDER BY id ASC').fetchall()])

@app.route('/api/users', methods=['GET', 'POST'])
def api_users():
    with get_db() as c:
        if request.method == 'POST':
            d = request.json or {}
            u = d.get('name', '').strip()
            role = d.get('role', 'Marketer')
            if role not in ['Admin', 'Sub-Admin', 'Media Buyer', 'Marketer']: role = 'Marketer'
            if u:
                c.execute('INSERT INTO users (name, role, email) VALUES (?,?,?)', (u, role, d.get('email', '').strip()))
        return jsonify([dict(r) for r in c.execute('SELECT * FROM users ORDER BY id ASC').fetchall()])

@app.route('/api/magic/<unique_id>')
def api_magic(unique_id):
    with get_db() as c:
        camp = c.execute('SELECT * FROM campaigns WHERE unique_id=?', (unique_id,)).fetchone()
        if not camp: return jsonify({'error': 'Not found'}), 404
        d = dict(camp)
        return jsonify({'unique_id': d['unique_id'], 'client_name': d['client_name'], 'meta_campaign_id': d['meta_campaign_id'],
                        'total_spent': d['total_spent'], 'total_budget': d['total_budget'], 'daily_budget': d['daily_budget'],
                        'status': d['status'], 'direction': d['direction'], 'category': d['category'],
                        'marketer_name': d['marketer_name'], 'quick_notes': d['quick_notes'], 'current_ad_account': d['current_ad_account'], 'read_only': True})

@app.route('/')
def index(): return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    if os.path.exists(path): return send_from_directory('.', path)
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port, debug=True)
