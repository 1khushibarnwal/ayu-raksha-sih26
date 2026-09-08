import type { DashboardNavSection } from '../types/navigation'

export const defaultDashboardSections: DashboardNavSection[] = [
  {
    id: 'portfolio_mgmt',
    title: '💼 Portfolio & Governance',
    items: [
      {
        id: 'innovations',
        title: 'My Innovations & Portfolio',
        description: 'Multi-version formulations, snapshots & statutory dossiers',
        to: '/innovations',
        icon: '💼',
      },
      {
        id: 'settings',
        title: 'Profile & Reasoning Rigor',
        description: 'Vaidya/Researcher persona, rigor modes & privacy controls',
        to: '/settings',
        icon: '⚙️',
      },
    ],
  },
  {
    id: 'core_screening',
    title: '🌿 Core Screening & Innovation',
    items: [
      {
        id: 'analyzer',
        title: 'Innovation Questionnaire',
        description: 'Guided 5-point Ayurvedic formulation novelty evaluator',
        to: '/analyzer',
        icon: '⚗️',
      },
      {
        id: 'tk_detector',
        title: 'Traditional Knowledge Detector',
        description: 'TKDL & Samhitas prior-art overlap screening',
        to: '/analyzer?tab=overview',
        icon: '📜',
      },
      {
        id: 'ai_classification',
        title: 'AI Statutory Classification',
        description: 'Schedule T & Rule 158-B regulatory categorization',
        to: '/analyzer?tab=overview',
        icon: '🏷️',
      },
    ],
  },
  {
    id: 'ip_risk_abs',
    title: '🛡️ IP Strategy, Risk & Biodiversity',
    items: [
      {
        id: 'ip_strategy',
        title: 'IP Protection Strategy',
        description: 'Section 3(p)/3(e) patent, trademark, design & trade secret routes',
        to: '/analyzer?tab=overview',
        icon: '🛡️',
      },
      {
        id: 'ip_risk_center',
        title: 'IP Risk Center (5-D Matrix)',
        description: 'Multi-dimensional statutory risk scoring & case laws',
        to: '/analyzer?tab=overview',
        icon: '⚠️',
      },
      {
        id: 'abs_checker',
        title: 'Biodiversity & ABS Checker',
        description: 'National Biodiversity Authority (NBA Form I/III) compliance',
        to: '/analyzer?tab=overview',
        icon: '🌿',
      },
    ],
  },
  {
    id: 'global_regulatory',
    title: '🌐 Global Readiness & Passports',
    items: [
      {
        id: 'regulatory_nav',
        title: 'Regulatory Navigator',
        description: 'Interactive 6-step statutory compliance wizard',
        to: '/analyzer?tab=overview',
        icon: '🛣️',
      },
      {
        id: 'market_sim',
        title: 'Global Market Simulator',
        description: 'US FDA DSHEA, EU THMPD, AYUSH, Japan & TGA readiness',
        to: '/analyzer?tab=markets',
        icon: '🌐',
      },
      {
        id: 'ayu_passport',
        title: 'AYU-IP Digital Passport',
        description: 'Official printable statutory readiness credential & certificate',
        to: '/analyzer?tab=passport',
        icon: '🛂',
      },
    ],
  },
  {
    id: 'roadmap_action_evidence',
    title: '🗺️ Commercialization & Actions',
    items: [
      {
        id: 'roadmap',
        title: '10-Stage Commercial Roadmap',
        description: 'Interactive formulation-to-market lifecycle milestones',
        to: '/analyzer?tab=roadmap',
        icon: '🗺️',
      },
      {
        id: 'action_center',
        title: 'Statutory Action Center',
        description: 'Prioritized legal filing checklist & progress tracker',
        to: '/analyzer?tab=action_center',
        icon: '⚡',
      },
      {
        id: 'evidence_locker',
        title: 'Audit-Grade Evidence Locker',
        description: 'Centralized statutory citations, Gazettes & references',
        to: '/analyzer?tab=evidence_locker',
        icon: '🗄️',
      },
    ],
  },
  {
    id: 'ai_research_expert',
    title: '🤖 Intelligence, Research & Escalation',
    items: [
      {
        id: 'ask_ai',
        title: 'Ask AYU-RAKSHA (Voice AI)',
        description: 'Multilingual RAG legal & regulatory assistant',
        to: '/analyzer?tab=chat_assistant',
        icon: '🤖',
      },
      {
        id: 'doc_upload',
        title: 'Smart Document Upload (OCR)',
        description: 'Extract formulation data from lab specs & certificates',
        to: '/analyzer?tab=doc_upload',
        icon: '📁',
      },
      {
        id: 'source_explorer',
        title: 'Source Explorer & Statutes',
        description: 'Codified Classical Texts, Acts, Rules & Pharmacopoeias',
        to: '/analyzer?tab=source_explorer',
        icon: '🔍',
      },
      {
        id: 'legal_timeline',
        title: 'Legal & Regulatory Timeline',
        description: 'Statutory evolution, amendments & historical diffs',
        to: '/analyzer?tab=legal_timeline',
        icon: '📜',
      },
      {
        id: 'expert_review',
        title: 'Human Expert Review Escalation',
        description: 'Connect with verified Ayurvedic Patent Attorneys & NBA specialists',
        to: '/analyzer?tab=expert_escalation',
        icon: '👨‍⚖️',
      },
    ],
  },
  {
    id: 'platform',
    title: 'Platform Modules',
    items: [
      {
        id: 'dashboard',
        title: 'Main Dashboard',
        description: 'Platform overview & wellness metrics',
        to: '/dashboard',
        icon: '⌂',
      },
      {
        id: 'assessment',
        title: 'Health Assessment',
        description: 'Interactive Ayurvedic wellness check',
        to: '/dashboard/assessment',
        icon: '✦',
      },
      {
        id: 'health',
        title: 'My Health Profile',
        description: 'Holistic health records & prakriti',
        to: '/dashboard/health',
        icon: '♡',
      },
      {
        id: 'insights',
        title: 'Insights',
        description: 'AI patterns & daily wisdom',
        to: '/dashboard/insights',
        icon: '◈',
      },
      {
        id: 'history',
        title: 'History & Records',
        description: 'Past assessments & timelines',
        to: '/dashboard/history',
        icon: '◷',
      },
    ],
  },
]
