// Frontend Application Logic
class S3SecurityDashboard {
    constructor() {
        this.alerts = [];
        this.currentAlert = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadFromLocalStorage();
    }
    
    initializeElements() {
        // Buttons
        this.scanBtn = document.getElementById('scanBtn');
        this.loadBtn = document.getElementById('loadBtn');
        this.exportBtn = document.getElementById('exportBtn');
        
        // Stats
        this.criticalCount = document.getElementById('criticalCount');
        this.highCount = document.getElementById('highCount');
        this.mediumCount = document.getElementById('mediumCount');
        this.lowCount = document.getElementById('lowCount');
        this.totalBuckets = document.getElementById('totalBuckets');
        
        // Table
        this.alertsBody = document.getElementById('alertsBody');
        this.findingsDetails = document.getElementById('findingsDetails');
        
        // Overlay
        this.loadingOverlay = document.getElementById('loadingOverlay');
    }
    
    bindEvents() {
        this.scanBtn.addEventListener('click', () => this.runScan());
        this.loadBtn.addEventListener('click', () => this.loadFromFile());
        this.exportBtn.addEventListener('click', () => this.exportToCSV());
    }
    
    async runScan() {
        this.showLoading(true);
        
        try {
            // Call backend API (you'll need to implement this)
            const response = await fetch('/api/scan', {
                method: 'POST'
            });
            
            if (response.ok) {
                const data = await response.json();
                this.alerts = data.alerts || [];
                this.updateDashboard();
                this.saveToLocalStorage();
            } else {
                throw new Error('Scan failed');
            }
        } catch (error) {
            console.error('Scan error:', error);
            
            // Fallback: Load mock data for demo
            await this.loadMockData();
        } finally {
            this.showLoading(false);
        }
    }
    
    async loadMockData() {
        // Mock data for demonstration
        this.alerts = [
            {
                id: '1',
                bucketName: 'my-public-bucket',
                severity: 'CRITICAL',
                score: 100,
                findings: [
                    { rule: 'PUBLIC_ACL_ACCESS', severity: 'HIGH', message: 'Bucket has public ACL grants' },
                    { rule: 'NO_ENCRYPTION', severity: 'HIGH', message: 'No server-side encryption configured' }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                bucketName: 'my-private-bucket',
                severity: 'HIGH',
                score: 80,
                findings: [
                    { rule: 'NO_ENCRYPTION', severity: 'HIGH', message: 'No server-side encryption configured' }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                bucketName: 's3-private-encrypted',
                severity: 'LOW',
                score: 20,
                findings: [
                    { rule: 'SSE_S3_ENCRYPTION', severity: 'LOW', message: 'Using SSE-S3 encryption (AES256)' }
                ],
                createdAt: new Date().toISOString()
            }
        ];
        
        this.updateDashboard();
        this.saveToLocalStorage();
    }
    
    updateDashboard() {
        this.updateStats();
        this.updateAlertsTable();
        this.updateFindingsDetails();
    }
    
    updateStats() {
        const counts = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0
        };
        
        this.alerts.forEach(alert => {
            if (counts[alert.severity.toLowerCase()] !== undefined) {
                counts[alert.severity.toLowerCase()]++;
            }
        });
        
        this.criticalCount.textContent = counts.critical;
        this.highCount.textContent = counts.high;
        this.mediumCount.textContent = counts.medium;
        this.lowCount.textContent = counts.low;
        this.totalBuckets.textContent = this.alerts.length;
    }
    
    updateAlertsTable() {
        this.alertsBody.innerHTML = '';
        
        this.alerts.forEach(alert => {
            const row = document.createElement('tr');
            row.addEventListener('click', () => this.showAlertDetails(alert));
            row.style.cursor = 'pointer';
            
            row.innerHTML = `
                <td><strong>${alert.bucketName}</strong></td>
                <td><span class="severity-badge severity-${alert.severity.toLowerCase()}">${alert.severity}</span></td>
                <td>${alert.score}</td>
                <td>${alert.findings.length}</td>
                <td>${new Date(alert.createdAt).toLocaleString()}</td>
                <td>
                    <button class="btn-small" onclick="event.stopPropagation(); dashboard.viewDetails('${alert.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            
            this.alertsBody.appendChild(row);
        });
    }
    
    showAlertDetails(alert) {
        this.currentAlert = alert;
        this.updateFindingsDetails();
    }
    
    updateFindingsDetails() {
        if (!this.currentAlert) {
            this.findingsDetails.innerHTML = '<p class="empty-state">Select an alert to view detailed findings...</p>';
            return;
        }
        
        let html = `
            <div class="alert-header">
                <h3>${this.currentAlert.bucketName} <span class="severity-badge severity-${this.currentAlert.severity.toLowerCase()}">${this.currentAlert.severity}</span></h3>
                <p>Risk Score: ${this.currentAlert.score} | Found: ${this.currentAlert.findings.length} issues</p>
                <p>Scanned: ${new Date(this.currentAlert.createdAt).toLocaleString()}</p>
            </div>
            <hr>
            <h4>Security Findings:</h4>
        `;
        
        this.currentAlert.findings.forEach((finding, index) => {
            html += `
                <div class="finding-item finding-${finding.severity.toLowerCase()}">
                    <h5>${index + 1}. ${finding.rule}</h5>
                    <p>${finding.message}</p>
                    <small>Severity: <span class="severity-badge severity-${finding.severity.toLowerCase()}">${finding.severity}</span></small>
                </div>
            `;
        });
        
        this.findingsDetails.innerHTML = html;
    }
    
    viewDetails(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            this.showAlertDetails(alert);
            
            // Scroll to details section
            document.querySelector('.details-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }
    
    loadFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    this.alerts = Array.isArray(data) ? data : [];
                    this.updateDashboard();
                    this.saveToLocalStorage();
                } catch (error) {
                    alert('Error loading file. Please check the format.');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    exportToCSV() {
        if (this.alerts.length === 0) {
            alert('No data to export');
            return;
        }
        
        // Convert to CSV
        const headers = ['Bucket', 'Severity', 'Score', 'Findings Count', 'Time'];
        const rows = this.alerts.map(alert => [
            alert.bucketName,
            alert.severity,
            alert.score,
            alert.findings.length,
            new Date(alert.createdAt).toLocaleString()
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        // Download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 's3-security-alerts.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }
    
    saveToLocalStorage() {
        localStorage.setItem('s3Alerts', JSON.stringify(this.alerts));
    }
    
    loadFromLocalStorage() {
        const saved = localStorage.getItem('s3Alerts');
        if (saved) {
            try {
                this.alerts = JSON.parse(saved);
                this.updateDashboard();
            } catch (e) {
                console.error('Error loading from localStorage:', e);
            }
        }
    }
    
    showLoading(show) {
        this.loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new S3SecurityDashboard();
    
    // Make dashboard available globally for button onclick handlers
    window.dashboard = dashboard;
});
