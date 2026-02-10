/**
 * Service Details - Dynamic Content Loader
 */

const SERVICES_DATA = {
    'ili': {
        title: 'Inline Inspection (ILI)',
        description: 'Advanced smart pigging technology for comprehensive internal pipeline assessment and anomaly detection.',
        heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=500&fit=crop',
        overviewTitle: 'State-of-the-Art Pipeline Inspection',
        overviewText1: 'Our Inline Inspection (ILI) services utilize cutting-edge smart pigging technology to provide comprehensive internal assessments of your pipeline infrastructure. We detect and characterize metal loss, cracks, geometry anomalies, and other defects with industry-leading accuracy.',
        overviewText2: 'With over 15 years of experience and 25,000+ kilometers of pipeline inspected, PipelinePro delivers reliable data that forms the foundation of effective integrity management programs.',
        benefits: ['MFL Technology', 'Ultrasonic Testing', 'EMAT Technology', 'Geometry Tools'],
        technologies: [
            {
                title: 'Magnetic Flux Leakage (MFL)',
                description: 'High-resolution metal loss detection for general corrosion and pitting. Our MFL tools provide accurate wall thickness measurements.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
            },
            {
                title: 'Ultrasonic Testing (UT)',
                description: 'High-accuracy wall thickness measurement and crack detection. UT technology provides precise metal loss quantification.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/><path d="M12 2v10"/></svg>'
            },
            {
                title: 'EMAT Technology',
                description: 'Advanced crack detection and stress corrosion cracking assessment. EMAT excels at detecting axially oriented cracks.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
            }
        ],
        capabilitiesTitle: 'What We Detect',
        capabilities: [
            { title: 'Metal Loss', description: 'General corrosion, pitting corrosion, and erosion.' },
            { title: 'Cracks', description: 'Longitudinal, circumferential, and crack colonies.' },
            { title: 'Dents & Buckles', description: 'Mechanical damage, dents, wrinkles, and buckles.' },
            { title: 'Geometry', description: 'Pipe diameter, ovality, and wall thickness variations.' },
            { title: 'Features', description: 'Valves, tees, flanges, welds, and other features.' },
            { title: 'Debris & Deposits', description: 'Internal deposits, wax, scale, and debris.' }
        ]
    },
    'dig-reports': {
        title: 'Dig Report Generation',
        description: 'Comprehensive excavation reports with detailed anomaly analysis, repair recommendations, and regulatory compliance.',
        heroImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=600&h=500&fit=crop',
        overviewTitle: 'Expert Dig Planning & Verification',
        overviewText1: 'Our Dig Report Generation service bridges the gap between inspection data and field action. We provide highly detailed, actionable excavation plans that prioritize safety and efficiency, ensuring your repair teams have precisely what they need.',
        overviewText2: 'Each report is meticulously reviewed by our senior integrity engineers to ensure 100% compliance with PHMSA and other regulatory standards.',
        benefits: ['Prioritized Anomalies', 'Repair Design', 'Regulatory Support', 'Actionable Insights'],
        technologies: [
            {
                title: 'Anomaly Prioritization',
                description: 'Smart sorting of inspection data based on severity and risk potential to optimize repair schedules.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
            },
            {
                title: 'GIS Integration',
                description: 'Precise GPS coordinates for excavation sites, integrated directly with your asset management systems.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
            },
            {
                title: 'Compliance Tracking',
                description: 'Automated documentation trails to satisfy regulatory requirements and simplify audit processes.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>'
            }
        ],
        capabilitiesTitle: 'Reporting Features',
        capabilities: [
            { title: 'GPS Location', description: 'Sub-meter accuracy for easy field location.' },
            { title: 'Repair Methods', description: 'Recommended sleeves or sections for repair.' },
            { title: 'Corrosion Maps', description: 'Detailed 2D and 3D visualization of metal loss.' },
            { title: 'Material Tracking', description: 'Recording pipe grade and coating types.' },
            { title: 'Photo Vault', description: 'Direct links to historic excavation photos.' },
            { title: 'Final Assessment', description: 'Post-repair integrity verification summaries.' }
        ]
    },
    'integrity': {
        title: 'Integrity Management',
        description: 'Strategic pipeline integrity programs including risk assessment, corrosion management, and regulatory compliance planning.',
        heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=500&fit=crop',
        overviewTitle: 'Holistic Pipeline Integrity Strategies',
        overviewText1: 'PipelinePro provides comprehensive Integrity Management Programs (IMP) that ensure your assets operate safely, reliably, and within all legal parameters. We help you move from reactive maintenance to proactive asset lifecycle management.',
        overviewText2: 'Our experts specialize in the development and implementation of documented IM programs tailored to your specific pipeline network and operating environment.',
        benefits: ['Risk Assessment', 'IMP Development', 'Compliance Audits', 'Threat Management'],
        technologies: [
            {
                title: 'Predictive Modeling',
                description: 'Advanced algorithms to forecast future degradation and prioritize long-term capital investments.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><path d="M16 5V3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2"/><path d="M3 12h12"/></svg>'
            },
            {
                title: 'Lifecycle Analysis',
                description: 'Total cost of ownership analysis to balance maintenance costs with asset lifespan extension.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16l-4-4-4 4"/><path d="M12 12V8"/></svg>'
            },
            {
                title: 'Auditing Tools',
                description: 'Internal auditing frameworks to ensure your program meets or exceeds federal requirements.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>'
            }
        ],
        capabilitiesTitle: 'Key IM Components',
        capabilities: [
            { title: 'Risk Engines', description: 'Custom risk calculation for all threats.' },
            { title: 'Regulatory Liaison', description: 'Communication with PHMSA and other bodies.' },
            { title: 'Data Integration', description: 'Unifying data from multiple external vendors.' },
            { title: 'Change Mgmt', description: 'Tracking modifications to assets over decades.' },
            { title: 'Training', description: 'Inspector and operator workshop programs.' },
            { title: 'Performance Metrics', description: 'KPI dashboards for integrity spending.' }
        ]
    },
    'cp': {
        title: 'Cathodic Protection',
        description: 'Complete cathodic protection system design, installation, and monitoring to prevent external corrosion of your pipeline assets.',
        heroImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=500&fit=crop',
        overviewTitle: 'Expert External Corrosion Control',
        overviewText1: 'Our Cathodic Protection (CP) services provide the primary defense against external corrosion. We design, install, and maintain impressed current and sacrificial anode systems that shield your pipeline from environmental degradation.',
        overviewText2: 'From soil resistivity surveys to complex interference analysis, we ensure your CP systems provide optimal protection while minimizing operating costs.',
        benefits: ['System Design', 'Annual Surveys', 'Remote Monitoring', 'AC Mitigation'],
        technologies: [
            {
                title: 'Remote Monitoring',
                description: 'Cloud-based rectifier monitoring systems for 24/7 status updates and automated interruption.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><path d="M12 20h.01"/></svg>'
            },
            {
                title: 'Interference Surveys',
                description: 'Detailed assessment of AC and DC stray currents that can compromise your pipeline integrity.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 4v16"/><path d="M14 4v16"/><path d="M10 4v16"/><path d="M6 4v16"/></svg>'
            },
            {
                title: 'Deep Anode Systems',
                description: 'Advanced deep-well groundbed designs for effective current distribution in congested areas.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>'
            }
        ],
        capabilitiesTitle: 'CP Services',
        capabilities: [
            { title: 'Resistivity Surveys', description: 'Soil analysis for groundbed placement.' },
            { title: 'CIS Surveys', description: 'Close interval potential surveys for gaps.' },
            { title: 'Anode Retrofits', description: 'Extension of aging CP system lifespans.' },
            { title: 'Rectifier Repair', description: 'Component level maintenance and upgrades.' },
            { title: 'Mitigation Design', description: 'Shielding from high-voltage AC lines.' },
            { title: 'Annual Benchmarking', description: 'System-wide health reports.' }
        ]
    },
    'coating': {
        title: 'Coating Inspection',
        description: 'Advanced coating assessment and quality control services to ensure long-term pipeline protection and integrity.',
        heroImage: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=600&h=500&fit=crop',
        overviewTitle: 'Integrity Starts at the Surface',
        overviewText1: 'A high-perfomance coating is the first line of defense against corrosion. Our coating inspection services ensure that new applications meet manufacturer standards and that existing coatings are still performing effectively.',
        overviewText2: 'Our NACE-certified coating inspectors provide independent verification of surface preparation, application environment, and final dry film thickness.',
        benefits: ['NACE Certification', 'Adhesion Testing', 'Holiday Detection', 'Q/A Reporting'],
        technologies: [
            {
                title: 'Holiday Detection',
                description: 'High-voltage porosity testing to identify microscopic gaps (holidays) in the coating film.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M2 12h20"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/></svg>'
            },
            {
                title: 'Surface Profile',
                description: 'Microscopic analysis of metal surface anchor patterns to ensure maximum coating adhesion.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
            },
            {
                title: 'Thermal Profiling',
                description: 'Monitoring pipe temperature during application for specialized coatings like Fusion Bonded Epoxy (FBE).',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M4.93 4.93l.07.07"/><path d="M19 12h2"/><path d="M3 12h2"/><path d="M12 19v2"/><path d="M12 3v2"/></svg>'
            }
        ],
        capabilitiesTitle: 'Coating Assessments',
        capabilities: [
            { title: 'DFT Measurement', description: 'Dry film thickness verification.' },
            { title: 'Adhesion Benchmarks', description: 'Pull-off and X-cut testing.' },
            { title: 'Environment Log', description: 'Humidity, dew point, and air temp logs.' },
            { title: 'FBE Inspection', description: 'Specialized plant and field joint Q/A.' },
            { title: 'Internal Linings', description: 'Flow efficiency and internal protection.' },
            { title: 'Batch Testing', description: 'Verification of coating product chemistry.' }
        ]
    },
    'data': {
        title: 'Data Analysis & Reporting',
        description: 'Expert analysis of inspection data with comprehensive reporting, trend analysis, and actionable recommendations.',
        heroImage: 'https://images.unsplash.com/photo-1551288049-bbda02313650?w=600&h=500&fit=crop',
        overviewTitle: 'Transforming Data Into Intelligence',
        overviewText1: 'Raw inspection data is only valuable when it is analyzed correctly. Our data analysts use proprietary tools to filter signal from noise, identifying critical threats that automated systems might overlook.',
        overviewText2: 'We provide clear, executive-level summaries alongside deep technical analysis, allowing your team to make confident decisions about asset management.',
        benefits: ['Expert Analysis', 'Custom Dashboards', 'Trend Discovery', 'Remaining Life'],
        technologies: [
            {
                title: 'Machine Learning',
                description: 'Pattern recognition algorithms trained on decades of historic pipeline default patterns.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 10v4"/><path d="M18 10v4"/></svg>'
            },
            {
                title: 'Visualization',
                description: 'Rich, interactive 3D models of your pipeline features for easier interpretation of complex datasets.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>'
            },
            {
                title: 'Data Reconciliation',
                description: 'Combining multiple inspection runs (run-to-run) to calculate accurate corrosion growth rates.',
                icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M21 3L12 12"/><path d="M3 21L12 12"/></svg>'
            }
        ],
        capabilitiesTitle: 'Analytics Suite',
        capabilities: [
            { title: 'Growth Analysis', description: 'Calculating Run-to-Run metal loss.' },
            { title: 'Risk Heatmaps', description: 'Visualizing threats along the right-of-way.' },
            { title: 'Budget Forecasting', description: 'Estimating future repair costs.' },
            { title: 'Actionable Alerts', description: 'Immediate notice for critical anomalies.' },
            { title: 'Interactive Portal', description: '24/7 access to your data via our portal.' },
            { title: 'Report Automation', description: 'Instant generation of recurring docs.' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('service') || 'ili';
    const data = SERVICES_DATA[serviceId];

    if (data) {
        // Update Title and Meta
        document.title = `${data.title} | PipelinePro`;

        // Update Hero
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.textContent = data.title;

        // Update Overview
        const overviewTitle = document.querySelector('.section-title');
        const overviewTexts = document.querySelectorAll('.about-content p');
        const overviewImage = document.querySelector('.about-image img');

        if (overviewTitle) overviewTitle.textContent = data.overviewTitle;
        if (overviewTexts[0]) overviewTexts[0].textContent = data.overviewText1;
        if (overviewTexts[1]) overviewTexts[1].textContent = data.overviewText2;
        if (overviewImage) {
            overviewImage.src = data.heroImage;
            overviewImage.alt = data.title;
        }

        // Update Benefits
        const benefitsContainer = document.querySelector('.about-content div[style*="grid-template-columns"]');
        if (benefitsContainer) {
            benefitsContainer.innerHTML = data.benefits.map(benefit => `
                <div style="display: flex; align-items: center; gap: var(--space-3);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span style="font-weight: var(--font-medium);">${benefit}</span>
                </div>
            `).join('');
        }

        // Update Technologies
        const techHeader = document.querySelector('section[style*="background-color: var(--bg-secondary)"] .section-title');
        const techDesc = document.querySelector('section[style*="background-color: var(--bg-secondary)"] .section-description');
        const techGrid = document.querySelector('section[style*="background-color: var(--bg-secondary)"] .services-grid');

        if (techHeader) techHeader.textContent = 'Service Features';
        if (techDesc) techDesc.textContent = 'Advanced methodologies to ensure the highest standards of pipeline integrity.';
        if (techGrid) {
            techGrid.innerHTML = data.technologies.map(tech => `
                <article class="card reveal active">
                    <div style="padding: var(--space-8);">
                        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200)); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-6); color: var(--color-primary-600);">
                            ${tech.icon}
                        </div>
                        <h3 style="font-size: var(--text-xl); margin-bottom: var(--space-3);">${tech.title}</h3>
                        <p style="color: var(--text-secondary);">${tech.description}</p>
                    </div>
                </article>
            `).join('');
        }

        // Update Capabilities
        const capHeader = document.querySelector('section:not([style]) .section-title');
        const capGrid = document.querySelector('.features-grid');

        if (capHeader && data.capabilitiesTitle) capHeader.textContent = data.capabilitiesTitle;
        if (capGrid) {
            capGrid.innerHTML = data.capabilities.map(cap => `
                <div class="feature-item reveal active">
                    <div class="feature-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <div class="feature-content">
                        <h3>${cap.title}</h3>
                        <p>${cap.description}</p>
                    </div>
                </div>
            `).join('');
        }
    }
});
