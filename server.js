const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// API endpoint to run scan
app.post('/api/scan', (req, res) => {
    console.log('Running S3 security scan...');
    
    // Run your Node.js scanner
    exec('node src/main.js', (error, stdout, stderr) => {
        if (error) {
            console.error('Scan error:', error);
            return res.status(500).json({ error: 'Scan failed' });
        }
        
        // Read the generated alerts
        try {
            const alertsData = fs.readFileSync('alerts_output.json', 'utf8');
            const alerts = JSON.parse(alertsData);
            
            res.json({
                success: true,
                message: 'Scan completed successfully',
                alerts: alerts,
                scanOutput: stdout
            });
        } catch (readError) {
            console.error('Error reading alerts:', readError);
            res.status(500).json({ error: 'Failed to read scan results' });
        }
    });
});

// API to get existing alerts
app.get('/api/alerts', (req, res) => {
    try {
        if (fs.existsSync('alerts_output.json')) {
            const alertsData = fs.readFileSync('alerts_output.json', 'utf8');
            const alerts = JSON.parse(alertsData);
            res.json({ alerts });
        } else {
            res.json({ alerts: [] });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to load alerts' });
    }
});

// API to export as CSV
app.get('/api/export/csv', (req, res) => {
    try {
        if (fs.existsSync('alerts_output.json')) {
            const alertsData = fs.readFileSync('alerts_output.json', 'utf8');
            const alerts = JSON.parse(alertsData);
            
            // Convert to CSV
            const headers = ['Bucket', 'Severity', 'Score', 'Findings', 'Time'];
            const rows = alerts.map(alert => [
                alert.bucketName,
                alert.severity,
                alert.score,
                alert.findings.length,
                alert.createdAt
            ]);
            
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="s3-security-alerts.csv"');
            res.send(csvContent);
        } else {
            res.status(404).json({ error: 'No alerts found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Export failed' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
});
