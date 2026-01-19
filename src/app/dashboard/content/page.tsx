'use client';

import { useState, useEffect } from 'react';
import { Save, Upload, Plus, Trash2, Edit2, Loader2, Layout, Users, MessageSquare, Briefcase, Info, Phone, Mail, ChevronRight, Globe, MapPin, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ContentManager() {
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<any>({});
    const [services, setServices] = useState<any[]>([]);
    const [team, setTeam] = useState<any[]>([]);

    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);

    // Reload Trigger
    const [refreshKey, setRefreshKey] = useState(0);

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

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey]);

    const handleMarkRead = async (id: string) => {
        try {
            const res = await fetch('/api/contact', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isRead: true })
            });

            if (res.ok) {
                setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
                toast.success('Marked as read');
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    // Generic Settings Update
    const updateSetting = (key: string, value: string) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const saveSettings = async () => {
        const toastId = toast.loading('Saving...');
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(settings)
            });
            if (res.ok) toast.success('Settings saved', { id: toastId });
            else toast.error('Failed to save settings', { id: toastId });
        } catch (e) {
            toast.error('Network Error', { id: toastId });
        }
    };

    // File Upload Helper
    const handleUpload = async (file: File): Promise<string | null> => {
        const toastId = toast.loading('Uploading...');
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
                toast.dismiss(toastId);
                return data.url;
            }
        } catch (e) {
            console.error(e);
        }
        toast.error('Upload failed', { id: toastId });
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

    if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    const unreadCount = messages.filter(m => !m.isRead).length;

    const tabs = [
        { id: 'home', label: 'Hero Section', icon: Layout, desc: 'Manage main landing visuals' },
        { id: 'about', label: 'Company Info', icon: Info, desc: 'Mission, Vision & Strategy' },
        { id: 'services', label: 'Our Services', icon: Briefcase, desc: 'Manage service offerings' },
        { id: 'team', label: 'Leadership', icon: Users, desc: 'Manage team members' },
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, desc: 'Client success stories' },
        { id: 'contact', label: 'Contact Details', icon: Phone, desc: 'Address, Email & Phone' },
        { id: 'messages', label: 'Inquiries', icon: Mail, desc: 'View received messages', count: unreadCount },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-slate-100 p-4 md:p-8 pb-32 transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Content Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Control your website&apos;s public facing content.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white dark:bg-[#161b22] rounded-2xl p-2 shadow-sm border border-slate-200 dark:border-white/5 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible sticky top-8">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group flex-shrink-0 lg:w-full ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/5 group-hover:bg-white/10'}`}>
                                        <tab.icon className="w-4 h-4" />
                                    </div>
                                    <div className="hidden md:block flex-1 text-left">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="font-bold text-sm leading-tight">{tab.label}</div>
                                            {(tab.count ?? 0) > 0 && (
                                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                    {tab.count}
                                                </span>
                                            )}
                                        </div>
                                        <div className={`text-[10px] mt-0.5 ${activeTab === tab.id ? 'text-blue-100' : 'text-slate-400'}`}>{tab.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white dark:bg-[#161b22] min-h-[600px] rounded-[32px] border border-slate-200 dark:border-white/5 shadow-xl p-6 md:p-10 relative overflow-hidden">

                            {/* Decorative Blur */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                            {activeTab === 'home' && (
                                <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hero Configuration</h2>
                                            <p className="text-slate-500 text-sm mt-1">Customize the main landing section.</p>
                                        </div>
                                        <button onClick={saveSettings} className="btn-primary"><Save className="w-4 h-4 mr-2" /> Save Changes</button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="bg-slate-50 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/5">
                                                {settings.home_bg ? (
                                                    <div className="relative aspect-video rounded-xl overflow-hidden group">
                                                        <Image src={settings.home_bg} alt="Hero BG" fill className="object-cover" unoptimized />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <span className="text-white font-bold text-sm">Background Preview</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 text-sm">No Image</div>
                                                )}
                                            </div>
                                            <label className="btn-secondary w-full cursor-pointer py-4">
                                                <Upload className="w-4 h-4 mr-2" /> Change Background
                                                <input type="file" className="hidden" onChange={async (e) => {
                                                    if (e.target.files?.[0]) {
                                                        const url = await handleUpload(e.target.files[0]);
                                                        if (url) updateSetting('home_bg', url);
                                                    }
                                                }} />
                                            </label>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="label-text">Company Name (Hero Title)</label>
                                                <input type="text" className="input-field font-bold text-lg" value={settings.home_title || ''} onChange={e => updateSetting('home_title', e.target.value)} placeholder="e.g. Spark Holding" />
                                            </div>
                                            <div>
                                                <label className="label-text">Tagline / Subtitle</label>
                                                <textarea className="input-field min-h-[120px] text-base" value={settings.home_subtitle || ''} onChange={e => updateSetting('home_subtitle', e.target.value)} placeholder="Enter a catchy tagline..." />
                                            </div>
                                            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {settings.home_logo ? (
                                                        <div className="w-16 h-16 bg-white dark:bg-black/20 rounded-lg p-2 flex items-center justify-center">
                                                            <Image src={settings.home_logo} alt="Logo" width={48} height={48} className="object-contain" unoptimized />
                                                        </div>
                                                    ) : <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>}
                                                    <div>
                                                        <div className="font-bold text-sm text-slate-900 dark:text-white">Brand Logo</div>
                                                        <div className="text-xs text-slate-500">PNG, JPG recommended</div>
                                                    </div>
                                                </div>
                                                <label className="btn-secondary cursor-pointer text-xs">
                                                    <Upload className="w-3 h-3 mr-2" /> Upload
                                                    <input type="file" className="hidden" onChange={async (e) => {
                                                        if (e.target.files?.[0]) {
                                                            const url = await handleUpload(e.target.files[0]);
                                                            if (url) updateSetting('home_logo', url);
                                                        }
                                                    }} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'about' && (
                                <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Company Information</h2>
                                            <p className="text-slate-500 text-sm mt-1">Define your mission, vision, and strategy.</p>
                                        </div>
                                        <button onClick={saveSettings} className="btn-primary"><Save className="w-4 h-4 mr-2" /> Save Changes</button>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { key: 'mission_text', label: 'Our Mission', placeholder: 'What drives your company?' },
                                            { key: 'vision_text', label: 'Our Vision', placeholder: 'Where are you heading?' },
                                            { key: 'strategy_text', label: 'Our Strategy', placeholder: 'How will you achieve your goals?' }
                                        ].map(field => (
                                            <div key={field.key} className="relative">
                                                <label className="label-text mb-2 block">{field.label}</label>
                                                <textarea
                                                    className="input-field min-h-[140px] text-base leading-relaxed"
                                                    value={settings[field.key] || ''}
                                                    onChange={e => updateSetting(field.key, e.target.value)}
                                                    placeholder={field.placeholder}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Details</h2>
                                            <p className="text-slate-500 text-sm mt-1">Where can people find you?</p>
                                        </div>
                                        <button onClick={saveSettings} className="btn-primary"><Save className="w-4 h-4 mr-2" /> Save Changes</button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            { key: 'contact_address', label: 'Physical Address', icon: MapPin },
                                            { key: 'contact_email', label: 'Email Address', icon: Mail },
                                            { key: 'contact_phone', label: 'Phone Number', icon: Phone },
                                            { key: 'contact_website', label: 'Website URL', icon: Globe },
                                        ].map(field => (
                                            <div key={field.key}>
                                                <label className="label-text flex items-center gap-2 mb-2">
                                                    <field.icon className="w-3 h-3 opacity-50" /> {field.label}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input-field"
                                                    value={settings[field.key] || ''}
                                                    onChange={e => updateSetting(field.key, e.target.value)}
                                                />
                                            </div>
                                        ))}
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
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 relative z-10">
                                    <div className="border-b border-slate-100 dark:border-white/5 pb-6">
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inbox</h2>
                                        <p className="text-slate-500 text-sm mt-1">Messages from your contact form.</p>
                                    </div>

                                    {messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center text-slate-400 mb-4">
                                                <Mail className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-500 font-bold">No messages yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {messages.map((msg: any) => (
                                                <div key={msg.id} className={`p-6 rounded-2xl border transition-all group relative overflow-hidden ${msg.isRead ? 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/20 shadow-md'}`}>
                                                    {!msg.isRead && (
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                                    )}

                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative ${msg.isRead ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300' : 'bg-blue-600 text-white'}`}>
                                                                {msg.name.charAt(0).toUpperCase()}
                                                                {!msg.isRead && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#0d1117]"></span>}
                                                            </div>
                                                            <div>
                                                                <h3 className={`font-bold text-lg leading-tight ${msg.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>{msg.name}</h3>
                                                                <a href={`mailto:${msg.email}`} className="text-blue-600 hover:text-blue-500 text-sm font-medium">{msg.email}</a>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {!msg.isRead && (
                                                                <button onClick={() => handleMarkRead(msg.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm">
                                                                    <CheckCircle className="w-3.5 h-3.5" /> Mark Read
                                                                </button>
                                                            )}
                                                            <span className="text-xs font-medium text-slate-400 bg-white dark:bg-black/20 px-3 py-1 rounded-full border border-slate-100 dark:border-white/5">
                                                                {new Date(msg.createdAt).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="pl-[52px]">
                                                        {msg.phone && <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2"><Phone className="w-3 h-3" /> {msg.phone}</div>}
                                                        <div className={`p-5 rounded-2xl text-sm leading-relaxed border ${msg.isRead ? 'bg-white dark:bg-black/20 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-white/5' : 'bg-white dark:bg-[#161b22] text-slate-900 dark:text-white border-blue-100 dark:border-blue-500/10 shadow-sm'}`}>
                                                            {msg.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .input-field {
                    @apply w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm transition-all focus:border-blue-500 dark:focus:border-blue-500 shadow-sm focus:bg-white dark:focus:bg-[#0a0c10];
                }
                .label-text {
                    @apply text-[11px] font-bold text-slate-500 uppercase tracking-widest;
                }
                .btn-primary {
                    @apply flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm active:scale-95;
                }
                .btn-secondary {
                    @apply flex items-center justify-center px-4 py-3 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold rounded-xl transition-all text-xs active:scale-95 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-sm;
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{type} List</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your {type} items.</p>
                </div>
                <button onClick={() => startEdit()} className="btn-primary"><Plus className="w-4 h-4 mr-2" /> Add New</button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {data.map((item: any) => (
                    <div key={item.id} className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/5 flex gap-4 group hover:border-blue-500/30 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-black/80 backdrop-blur rounded-bl-xl border-l border-b border-white/10">
                            <button onClick={() => startEdit(item)} className="p-2 hover:bg-blue-500/20 text-blue-500 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => onDelete(item.id, data)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>

                        <div className="flex-shrink-0">
                            {(item.photoUrl || item.imageUrl) ? (
                                <Image src={item.photoUrl || item.imageUrl} alt="Item" width={64} height={64} className="w-16 h-16 rounded-xl object-cover bg-slate-200 dark:bg-white/10" unoptimized />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center">
                                    <Layout className="w-6 h-6 text-slate-400" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 pr-12">
                            <h3 className="font-bold text-slate-900 dark:text-white truncate text-lg">{item.title || item.name || item.clientName}</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">{item.role || (type === 'services' ? 'Service' : 'Client')}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                            {item.linkedinUrl && <p className="text-xs text-blue-500 mt-2 truncate">{item.linkedinUrl}</p>}
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white dark:bg-[#161b22] w-full max-w-lg p-8 rounded-[32px] border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                        <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{editingItem ? 'Edit Item' : 'Create New Item'}</h3>

                        <div className="space-y-5">
                            {type === 'services' && (
                                <>
                                    <div><label className="label-text mb-1 block">Title</label><input className="input-field" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                                    <div><label className="label-text mb-1 block">Description</label><textarea className="input-field min-h-[100px]" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                                </>
                            )}
                            {type === 'team' && (
                                <>
                                    <div className="flex items-center gap-6 mb-4">
                                        <div className="relative w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 flex-shrink-0">
                                            {form.photoUrl && <Image src={form.photoUrl} alt="Preview" fill className="object-cover" unoptimized />}
                                        </div>
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
                                    <div><label className="label-text mb-1 block">Full Name</label><input className="input-field" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                                    <div><label className="label-text mb-1 block">Role / Position</label><input className="input-field" value={form.role || ''} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
                                    <div><label className="label-text mb-1 block">LinkedIn Profile</label><input className="input-field" value={form.linkedinUrl || ''} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} /></div>
                                </>
                            )}
                            {type === 'testimonials' && (
                                <>
                                    <div className="flex items-center gap-6 mb-4">
                                        <div className="relative w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 flex-shrink-0">
                                            {form.imageUrl && <Image src={form.imageUrl} alt="Preview" fill className="object-cover" unoptimized />}
                                        </div>
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
                                    <div><label className="label-text mb-1 block">Client Name</label><input className="input-field" value={form.clientName || ''} onChange={e => setForm({ ...form, clientName: e.target.value })} /></div>
                                    <div><label className="label-text mb-1 block">Testimonial</label><textarea className="input-field min-h-[100px]" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                                </>
                            )}
                        </div>

                        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                            <button onClick={() => setIsEditing(false)} className="flex-1 btn-secondary text-slate-500">Cancel</button>
                            <button onClick={submit} className="flex-1 btn-primary">Save Item</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
