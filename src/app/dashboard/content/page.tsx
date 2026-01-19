
'use client';

import { useState, useEffect } from 'react';
import { Save, Upload, Plus, Trash2, Edit2, Loader2, Image as ImageIcon, Layout, Users, MessageSquare, Briefcase, Info, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContentManager() {
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<any>({});
    const [services, setServices] = useState<any[]>([]);
    const [team, setTeam] = useState<any[]>([]);

    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);

    // Load Data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [paramsRes, servRes, teamRes, testRes, msgRes] = await Promise.all([
                fetch('/api/admin/settings'),
                fetch('/api/admin/services'),
                fetch('/api/admin/team'),
                fetch('/api/admin/testimonials'),
                fetch('/api/contact')
            ]);

            if (paramsRes.ok) setSettings(await paramsRes.json());
            if (servRes.ok) setServices(await servRes.json());
            if (teamRes.ok) setTeam(await teamRes.json());
            if (testRes.ok) setTestimonials(await testRes.json());
            if (msgRes.ok) setMessages(await msgRes.json());

        } catch (e) {
            toast.error('Failed to load content data');
        } finally {
            setLoading(false);
        }
    };

    // Generic Settings Update
    const updateSetting = (key: string, value: string) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const saveSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(settings)
            });
            if (res.ok) toast.success('Settings saved');
            else toast.error('Failed to save settings');
        } catch (e) {
            toast.error('Network Error');
        }
    };

    // File Upload Helper
    const handleUpload = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                return data.url;
            }
        } catch (e) {
            console.error(e);
        }
        return null;
    };

    // Generic CRUD for Lists
    const handleCreate = async (endpoint: string, data: any, setter: any, list: any[]) => {
        try {
            const res = await fetch(`/api/admin/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const newItem = await res.json();
                setter([...list, newItem]);
                toast.success('Item added');
                return true;
            }
        } catch (e) { toast.error('Error creating item'); }
        return false;
    };

    const handleUpdate = async (endpoint: string, id: string, data: any, setter: any, list: any[]) => {
        try {
            const res = await fetch(`/api/admin/${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ id, ...data })
            });
            if (res.ok) {
                const updated = await res.json();
                setter(list.map(i => i.id === id ? updated : i));
                toast.success('Item updated');
                return true;
            }
        } catch (e) { toast.error('Error updating item'); }
        return false;
    };

    const handleDelete = async (endpoint: string, id: string, setter: any, list: any[]) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`/api/admin/${endpoint}?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                setter(list.filter(i => i.id !== id));
                toast.success('Item deleted');
            }
        } catch (e) { toast.error('Error deleting item'); }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    const tabs = [
        { id: 'home', label: 'Home Page', icon: Layout },
        { id: 'about', label: 'About Us', icon: Info },
        { id: 'services', label: 'Services', icon: Briefcase },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
        { id: 'contact', label: 'Contact', icon: Phone },
        { id: 'messages', label: 'Messages', icon: Mail },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-slate-100 p-6 pb-32">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Manage Site Content</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white dark:bg-[#161b22] hover:bg-slate-100 dark:hover:bg-white/5'}`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        {activeTab === 'home' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <div className="bg-white dark:bg-[#161b22] p-8 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-xl">
                                    <h2 className="text-xl font-bold mb-4">Hero Section</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Company Name</label>
                                            <input type="text" className="input-field" value={settings.home_title || 'Spark Holding Group'} onChange={e => updateSetting('home_title', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tagline</label>
                                            <textarea className="input-field min-h-[100px]" value={settings.home_subtitle || ''} onChange={e => updateSetting('home_subtitle', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Background Image</label>
                                            <div className="flex flex-col md:flex-row items-center gap-6 mt-2">
                                                {settings.home_bg && (
                                                    <div className="relative group">
                                                        <img src={settings.home_bg} alt="bg" className="w-48 h-28 object-cover rounded-xl border-2 border-slate-200 dark:border-slate-700" />
                                                        <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">Current BG</div>
                                                    </div>
                                                )}
                                                <label className="btn-secondary cursor-pointer">
                                                    <Upload className="w-4 h-4 mr-2" /> Upload BG
                                                    <input type="file" className="hidden" onChange={async (e) => {
                                                        if (e.target.files?.[0]) {
                                                            const url = await handleUpload(e.target.files[0]);
                                                            if (url) updateSetting('home_bg', url);
                                                        }
                                                    }} />
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Logo</label>
                                            <div className="flex items-center gap-4">
                                                {settings.home_logo && <img src={settings.home_logo} alt="logo" className="w-16 h-16 object-contain rounded-lg bg-slate-800" />}
                                                <label className="btn-secondary cursor-pointer">
                                                    <Upload className="w-4 h-4 mr-2" /> Upload Logo
                                                    <input type="file" className="hidden" onChange={async (e) => {
                                                        if (e.target.files?.[0]) {
                                                            const url = await handleUpload(e.target.files[0]);
                                                            if (url) updateSetting('home_logo', url);
                                                        }
                                                    }} />
                                                </label>
                                            </div>
                                        </div>
                                        <button onClick={saveSettings} className="btn-primary mt-4"><Save className="w-4 h-4 mr-2" /> Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <div className="bg-white dark:bg-[#161b22] p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-6">
                                    <div>
                                        <h3 className="font-bold mb-2">Our Mission</h3>
                                        <textarea className="input-field min-h-[100px]" value={settings.mission_text || ''} onChange={e => updateSetting('mission_text', e.target.value)} placeholder="Mission statement..." />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-2">Our Vision</h3>
                                        <textarea className="input-field min-h-[100px]" value={settings.vision_text || ''} onChange={e => updateSetting('vision_text', e.target.value)} placeholder="Vision statement..." />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-2">Our Strategy</h3>
                                        <textarea className="input-field min-h-[100px]" value={settings.strategy_text || ''} onChange={e => updateSetting('strategy_text', e.target.value)} placeholder="Strategy details..." />
                                    </div>
                                    <button onClick={saveSettings} className="btn-primary"><Save className="w-4 h-4 mr-2" /> Save Changes</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'contact' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <div className="bg-white dark:bg-[#161b22] p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Address</label>
                                        <input type="text" className="input-field" value={settings.contact_address || ''} onChange={e => updateSetting('contact_address', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
                                        <input type="text" className="input-field" value={settings.contact_email || ''} onChange={e => updateSetting('contact_email', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone</label>
                                        <input type="text" className="input-field" value={settings.contact_phone || ''} onChange={e => updateSetting('contact_phone', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Website</label>
                                        <input type="text" className="input-field" value={settings.contact_website || ''} onChange={e => updateSetting('contact_website', e.target.value)} />
                                    </div>
                                    <button onClick={saveSettings} className="btn-primary mt-4"><Save className="w-4 h-4 mr-2" /> Save Changes</button>
                                </div>
                            </div>
                        )}

                        {/* List Managers */}
                        {['services', 'team', 'testimonials'].includes(activeTab) && (
                            <ListManager
                                type={activeTab}
                                data={activeTab === 'services' ? services : activeTab === 'team' ? team : testimonials}
                                setData={activeTab === 'services' ? setServices : activeTab === 'team' ? setTeam : setTestimonials}
                                onUpload={handleUpload}
                                onCreate={(d: any, l: any) => handleCreate(activeTab, d, activeTab === 'services' ? setServices : activeTab === 'team' ? setTeam : setTestimonials, l)}
                                onUpdate={(id: any, d: any, l: any) => handleUpdate(activeTab, id, d, activeTab === 'services' ? setServices : activeTab === 'team' ? setTeam : setTestimonials, l)}
                                onDelete={(id: any, l: any) => handleDelete(activeTab, id, activeTab === 'services' ? setServices : activeTab === 'team' ? setTeam : setTestimonials, l)}
                            />
                        )}

                        {activeTab === 'messages' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <div className="bg-white dark:bg-[#161b22] p-8 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-xl">
                                    <h2 className="text-xl font-bold mb-6">Received Messages</h2>
                                    {messages.length === 0 ? (
                                        <p className="text-slate-500">No messages yet.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {messages.map((msg: any) => (
                                                <div key={msg.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex flex-col">
                                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{msg.name}</h3>
                                                            <span className="text-xs text-slate-500">{new Date(msg.createdAt).toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <a href={`mailto:${msg.email}`} className="text-blue-600 hover:text-blue-500 text-sm font-medium">{msg.email}</a>
                                                        </div>
                                                    </div>
                                                    {msg.phone && <p className="text-sm text-slate-500 mb-2">Phone: {msg.phone}</p>}
                                                    <div className="mt-4 p-4 bg-white dark:bg-black/20 rounded-xl text-slate-700 dark:text-slate-300">
                                                        {msg.message}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .input-field {
                    @apply w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white text-sm transition-all focus:bg-white dark:focus:bg-[#161b22];
                }
                .btn-primary {
                    @apply flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm active:scale-95;
                }
                .btn-secondary {
                    @apply flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold rounded-xl transition-all text-xs active:scale-95 border border-transparent hover:border-slate-300 dark:hover:border-white/20;
                }
            `}</style>
        </div>
    );
}

function ListManager({ type, data, setData, onUpload, onCreate, onUpdate, onDelete }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [form, setForm] = useState<any>({});

    const startEdit = (item: any = null) => {
        setEditingItem(item);
        setForm(item || {});
        setIsEditing(true);
    };

    const submit = async () => {
        let success = false;
        if (editingItem) {
            success = await onUpdate(editingItem.id, form, data);
        } else {
            success = await onCreate(form, data);
        }
        if (success) {
            setIsEditing(false);
            setForm({});
            setEditingItem(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold capitalize">{type} List</h2>
                <button onClick={() => startEdit()} className="btn-primary"><Plus className="w-4 h-4 mr-2" /> Add New</button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {data.map((item: any) => (
                    <div key={item.id} className="bg-white dark:bg-[#161b22] p-6 rounded-2xl border border-slate-200 dark:border-white/5 flex justify-between items-start group">
                        <div className="flex gap-4">
                            {(item.photoUrl || item.imageUrl) && (
                                <img src={item.photoUrl || item.imageUrl} className="w-12 h-12 rounded-full object-cover bg-slate-800" />
                            )}
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{item.title || item.name || item.clientName}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2">{item.description || item.role}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(item)} className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => onDelete(item.id, data)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#161b22] w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl relative">
                        <h3 className="text-xl font-bold mb-6">{editingItem ? 'Edit Item' : 'New Item'}</h3>

                        <div className="space-y-4">
                            {type === 'services' && (
                                <>
                                    <input placeholder="Title" className="input-field" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} />
                                    <textarea placeholder="Description" className="input-field min-h-[100px]" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
                                </>
                            )}
                            {type === 'team' && (
                                <>
                                    <div className="flex items-center gap-4">
                                        {form.photoUrl && <img src={form.photoUrl} className="w-16 h-16 rounded-full object-cover" />}
                                        <label className="btn-secondary cursor-pointer">
                                            <Upload className="w-4 h-4 mr-2" /> Upload Photo
                                            <input type="file" className="hidden" onChange={async (e) => {
                                                if (e.target.files?.[0]) {
                                                    const url = await onUpload(e.target.files[0]);
                                                    if (url) setForm({ ...form, photoUrl: url });
                                                }
                                            }} />
                                        </label>
                                    </div>
                                    <input placeholder="Name" className="input-field" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    <input placeholder="Role" className="input-field" value={form.role || ''} onChange={e => setForm({ ...form, role: e.target.value })} />
                                    <input placeholder="LinkedIn URL" className="input-field" value={form.linkedinUrl || ''} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} />
                                </>
                            )}
                            {type === 'testimonials' && (
                                <>
                                    <div className="flex items-center gap-4">
                                        {form.imageUrl && <img src={form.imageUrl} className="w-16 h-16 rounded-full object-cover" />}
                                        <label className="btn-secondary cursor-pointer">
                                            <Upload className="w-4 h-4 mr-2" /> Upload Photo
                                            <input type="file" className="hidden" onChange={async (e) => {
                                                if (e.target.files?.[0]) {
                                                    const url = await onUpload(e.target.files[0]);
                                                    if (url) setForm({ ...form, imageUrl: url });
                                                }
                                            }} />
                                        </label>
                                    </div>
                                    <input placeholder="Client Name" className="input-field" value={form.clientName || ''} onChange={e => setForm({ ...form, clientName: e.target.value })} />
                                    <textarea placeholder="Testimonial" className="input-field min-h-[100px]" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
                                </>
                            )}
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setIsEditing(false)} className="flex-1 btn-secondary">Cancel</button>
                            <button onClick={submit} className="flex-1 btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
