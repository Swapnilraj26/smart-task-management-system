import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  CheckSquare, 
  Briefcase, 
  Bell, 
  LayoutDashboard, 
  Activity,
  Server,
  Database,
  Cpu,
  Globe
} from 'lucide-react';
import { GlowCard } from './components/GlowCard';

const API = axios.create({ baseURL: '/api' });

// --- Components ---

const Sidebar = () => {
  const location = useLocation();
  const links = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, label: 'D' },
    { name: 'Users', path: '/users', icon: <Users size={20} />, label: 'U' },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} />, label: 'T' },
    { name: 'Projects', path: '/projects', icon: <Briefcase size={20} />, label: 'P' },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} />, label: 'N' },
  ];

  return (
    <aside className="w-16 bg-bg-card border-r border-border-main flex flex-col items-center py-6 gap-6 sticky top-0 h-screen">
      <div className="w-10 h-10 border border-border-main rounded-lg flex items-center justify-center font-bold text-accent-task bg-accent-task/5">
        S
      </div>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`w-10 h-10 border rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
              location.pathname === link.path 
                ? 'border-accent-task text-accent-task bg-accent-task/10' 
                : 'border-border-main text-text-dim hover:text-text-main hover:border-zinc-500'
            }`}
            title={link.name}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

const Header = () => (
  <header className="flex justify-between items-end mb-8 pb-4 border-b border-border-main">
    <div>
      <div className="text-[10px] text-accent-task font-bold tracking-widest mb-1 uppercase">Cloud Cluster: Production-A</div>
      <h1 className="text-2xl font-bold tracking-tight">Smart Task Management</h1>
    </div>
    <div className="status-pill">Cluster Online • Ready</div>
  </header>
);

// --- Pages ---

const Dashboard = () => {
  const [counts, setCounts] = useState({ users: 0, tasks: 0, projects: 0, notifications: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, t, p, n] = await Promise.all([
          API.get('/users').catch(() => ({ data: [] })),
          API.get('/tasks').catch(() => ({ data: [] })),
          API.get('/projects').catch(() => ({ data: [] })),
          API.get('/notifications').catch(() => ({ data: [] }))
        ]);
        setCounts({
          users: u.data.length,
          tasks: t.data.length,
          projects: p.data.length,
          notifications: n.data.length
        });
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 flex flex-col min-h-full max-w-6xl mx-auto">
      <Header />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
        {/* User Service Card */}
        <GlowCard type="user" className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-dim">User Service</span>
            <span className="port-tag">Port 5001</span>
          </div>
          <form className="space-y-2 mb-6" onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            try { await API.post('/users/register', Object.fromEntries(fd)); alert('User added'); (e.target as HTMLFormElement).reset(); } catch (err) { alert('Svc Error'); }
          }}>
            <div className="flex gap-2">
              <input name="name" placeholder="Full Name" className="input-field" required />
              <input name="email" type="email" placeholder="Email Address" className="input-field" required />
            </div>
            <div className="flex gap-2">
              <input name="password" type="password" placeholder="Password" className="input-field" required />
              <button type="submit" className="btn-accent bg-accent-user w-32 shrink-0">Add User</button>
            </div>
          </form>
        </GlowCard>

        {/* Task Service Card */}
        <GlowCard type="task" className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-dim">Task Service</span>
            <span className="port-tag">Port 5002</span>
          </div>
          <form className="space-y-2 mb-6" onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            try { await API.post('/tasks', Object.fromEntries(fd)); alert('Task assigned'); (e.target as HTMLFormElement).reset(); } catch (err) { alert('Svc Error'); }
          }}>
            <div className="flex gap-2">
              <input name="title" placeholder="Task Title" className="input-field" required />
              <select name="priority" className="input-field w-32">
                <option>Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input name="assignedUser" placeholder="Assigned To (User ID)" className="input-field" />
              <button type="submit" className="btn-accent bg-accent-task w-32 shrink-0">Assign Task</button>
            </div>
          </form>
        </GlowCard>

        {/* Project Service Card */}
        <GlowCard type="project" className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-dim">Project Service</span>
            <span className="port-tag">Port 5003</span>
          </div>
          <form className="space-y-2 mb-6" onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            try { await API.post('/projects', Object.fromEntries(fd)); alert('Project init'); (e.target as HTMLFormElement).reset(); } catch (err) { alert('Svc Error'); }
          }}>
            <div className="flex gap-2">
              <input name="projectName" placeholder="Project Name" className="input-field" required />
              <input name="endDate" type="date" className="input-field w-40" />
            </div>
            <div className="flex gap-2">
              <input name="teamSize" placeholder="Team Size" className="input-field" />
              <button type="submit" className="btn-accent bg-accent-project w-32 shrink-0">Init Project</button>
            </div>
          </form>
        </GlowCard>

        {/* Notification Service Card */}
        <GlowCard type="notify" className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-dim">Notification Service</span>
            <span className="port-tag">Port 5004</span>
          </div>
          <form className="space-y-2 mb-6" onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            try { await API.post('/notifications', Object.fromEntries(fd)); alert('Alert sent'); (e.target as HTMLFormElement).reset(); } catch (err) { alert('Svc Error'); }
          }}>
            <input name="message" placeholder="Message content..." className="input-field" required />
            <div className="flex gap-2">
              <input name="userId" placeholder="User ID" className="input-field" />
              <button type="submit" className="btn-accent bg-accent-notify w-32 shrink-0">Send Alert</button>
            </div>
          </form>
        </GlowCard>
      </div>
    </div>
  );
};

const DataPage = ({ type, endpoint }: { type: string, endpoint: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(endpoint)
      .then(res => setData(res.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [endpoint]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8 border-b border-border-main pb-4">
        <div className="text-[10px] font-bold text-accent-task tracking-widest mb-1">RAW CLUSTER DATA</div>
        <h2 className="text-2xl font-bold uppercase tracking-tighter">{type} Registry</h2>
      </header>

      <GlowCard className="bg-bg-deep/50 border-border-main p-0 overflow-hidden">
        <div className="bg-bg-card border-b border-border-main p-3 flex items-center justify-between">
          <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Output • GET {endpoint}</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-border-main"></div>
            <div className="w-2 h-2 rounded-full bg-border-main"></div>
            <div className="w-2 h-2 rounded-full bg-border-main"></div>
          </div>
        </div>
        <pre className="text-accent-project font-mono text-[12px] overflow-auto max-h-[600px] p-6 leading-relaxed">
          {loading ? '// Initializing fetch sequence...' : JSON.stringify(data, null, 2)}
        </pre>
      </GlowCard>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="flex bg-bg-deep min-h-screen text-text-main selection:bg-accent-task/30">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<DataPage type="Users" endpoint="/users" />} />
            <Route path="/tasks" element={<DataPage type="Tasks" endpoint="/tasks" />} />
            <Route path="/projects" element={<DataPage type="Projects" endpoint="/projects" />} />
            <Route path="/notifications" element={<DataPage type="Notifications" endpoint="/notifications" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
