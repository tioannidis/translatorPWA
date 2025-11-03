// API Usage & Cost Tracker for Puter Translator
// Uses puter.auth.getMonthlyUsage() to show monthly usage statistics

// Show API usage and costs
async function showApiUsage() {
    const usageDisplay = document.getElementById('apiUsageDisplay');
    const usageContent = document.getElementById('usageContent');
    const apiUsageBtn = document.getElementById('apiUsageBtn');

    // Check if user is logged in
    if (!puterAuth || !puterAuth.isLoggedIn) {
        usageContent.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #dc3545;">
                <p style="font-size: 16px; margin-bottom: 10px;">❌ Du musst dich zuerst bei Puter anmelden!</p>
                <p style="font-size: 14px; color: #666;">Klicke auf den "Puter Login" Button oben rechts.</p>
            </div>
        `;
        usageDisplay.style.display = 'block';
        return;
    }

    // Disable button and show loading
    apiUsageBtn.disabled = true;
    apiUsageBtn.textContent = '⏳ Lade Daten...';

    try {
        // Show loading state
        usageContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 10px; color: #666;">Lade Nutzungsdaten...</p>
            </div>
        `;
        usageDisplay.style.display = 'block';

        // Call Puter API to get monthly usage (no parameters needed!)
        const usageData = await puter.auth.getMonthlyUsage();

        console.log('Monthly usage data received:', usageData);

        // Display the results
        displayUsageData(usageData);

    } catch (error) {
        console.error('Error fetching API usage:', error);

        usageContent.innerHTML = `
            <div style="padding: 20px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px;">
                <p style="color: #856404; margin-bottom: 10px;"><strong>⚠️ Fehler beim Abrufen der Nutzungsdaten</strong></p>
                <p style="font-size: 14px; color: #666; margin-bottom: 10px;">${error.message || 'Unbekannter Fehler'}</p>
                <details style="margin-top: 10px; font-size: 12px; color: #666;">
                    <summary style="cursor: pointer; color: #667eea;">Technische Details</summary>
                    <pre style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; overflow-x: auto;">${JSON.stringify(error, null, 2)}</pre>
                </details>
            </div>
        `;
    } finally {
        // Re-enable button
        apiUsageBtn.disabled = false;
        apiUsageBtn.textContent = '💸 Kosten anzeigen';
    }
}

// Display usage data in a formatted way
function displayUsageData(data) {
    const usageContent = document.getElementById('usageContent');

    if (!data) {
        usageContent.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <p style="color: #666; font-size: 16px;">📊 Keine Nutzungsdaten verfügbar</p>
            </div>
        `;
        return;
    }

    // Convert microcents to dollars (1 dollar = 100,000,000 microcents)
    const microcentsToDollars = (microcents) => {
        return (microcents / 100000000).toFixed(6);
    };

    let html = '';

    // Display Allowance Information
    if (data.allowanceInfo) {
        const allowance = data.allowanceInfo.monthUsageAllowance || 0;
        const remaining = data.allowanceInfo.remaining || 0;
        const used = allowance - remaining;
        const usedPercent = allowance > 0 ? ((used / allowance) * 100).toFixed(1) : 0;

        html += `
            <div style="margin-bottom: 25px;">
                <h5 style="color: #667eea; margin-bottom: 15px; font-size: 16px;">📊 Monatliches Kontingent</h5>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px;">
                    <div style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; text-align: center;">
                        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">Gesamtkontingent</div>
                        <div style="font-size: 24px; font-weight: bold;">$${microcentsToDollars(allowance)}</div>
                        <div style="font-size: 11px; opacity: 0.8; margin-top: 3px;">${allowance.toLocaleString()} µ¢</div>
                    </div>

                    <div style="padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 10px; text-align: center;">
                        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">Verbraucht</div>
                        <div style="font-size: 24px; font-weight: bold;">$${microcentsToDollars(used)}</div>
                        <div style="font-size: 11px; opacity: 0.8; margin-top: 3px;">${used.toLocaleString()} µ¢</div>
                    </div>

                    <div style="padding: 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 10px; text-align: center;">
                        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">Verbleibend</div>
                        <div style="font-size: 24px; font-weight: bold;">$${microcentsToDollars(remaining)}</div>
                        <div style="font-size: 11px; opacity: 0.8; margin-top: 3px;">${remaining.toLocaleString()} µ¢</div>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div style="background: #e9ecef; border-radius: 10px; height: 20px; overflow: hidden; position: relative;">
                    <div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); height: 100%; width: ${usedPercent}%; transition: width 0.3s ease;"></div>
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; color: ${usedPercent > 50 ? 'white' : '#333'};">
                        ${usedPercent}% verbraucht
                    </div>
                </div>
            </div>
        `;
    }

    // Display App Totals
    if (data.appTotals && Object.keys(data.appTotals).length > 0) {
        html += `
            <h5 style="color: #667eea; margin: 25px 0 15px 0; font-size: 16px;">📱 Nutzung nach App</h5>
            <div style="display: grid; gap: 12px;">
        `;

        for (const [appName, appData] of Object.entries(data.appTotals)) {
            const cost = appData.totals || 0;
            const count = appData.count || 0;
            const costInDollars = microcentsToDollars(cost);

            html += `
                <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="font-weight: 600; color: #333;">
                            📱 ${appName}
                        </div>
                        <div style="font-size: 18px; font-weight: bold; color: #667eea;">
                            $${costInDollars}
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 12px; color: #666;">
                        <div>
                            <div style="opacity: 0.8;">Aufrufe</div>
                            <div style="font-weight: 600; color: #333;">${count.toLocaleString()}</div>
                        </div>
                        <div>
                            <div style="opacity: 0.8;">Mikrocents</div>
                            <div style="font-weight: 600; color: #333;">${cost.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        html += '</div>';
    }

    // Display Detailed API Usage
    if (data.usage && Object.keys(data.usage).length > 0) {
        html += `
            <h5 style="color: #667eea; margin: 25px 0 15px 0; font-size: 16px;">🔧 API-Nutzung Details</h5>
            <div style="display: grid; gap: 12px;">
        `;

        for (const [apiName, apiData] of Object.entries(data.usage)) {
            const cost = apiData.cost || 0;
            const count = apiData.count || 0;
            const units = apiData.units || 0;
            const costInDollars = microcentsToDollars(cost);

            // Get emoji for different API types
            const getApiEmoji = (name) => {
                if (name.includes('ai') || name.includes('chat')) return '🤖';
                if (name.includes('storage') || name.includes('fs')) return '💾';
                if (name.includes('auth')) return '🔐';
                if (name.includes('kv')) return '🗄️';
                return '📡';
            };

            html += `
                <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #764ba2;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="font-weight: 600; color: #333;">
                            ${getApiEmoji(apiName)} ${apiName}
                        </div>
                        <div style="font-size: 18px; font-weight: bold; color: #764ba2;">
                            $${costInDollars}
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 10px; font-size: 12px; color: #666;">
                        <div>
                            <div style="opacity: 0.8;">Aufrufe</div>
                            <div style="font-weight: 600; color: #333;">${count.toLocaleString()}</div>
                        </div>
                        <div>
                            <div style="opacity: 0.8;">Einheiten</div>
                            <div style="font-weight: 600; color: #333;">${units.toLocaleString()}</div>
                        </div>
                        <div>
                            <div style="opacity: 0.8;">Mikrocents</div>
                            <div style="font-weight: 600; color: #333;">${cost.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        html += '</div>';
    }

    // Info box
    html += `
        <div style="margin-top: 20px; padding: 15px; background: #e7f3ff; border-radius: 8px; font-size: 12px; color: #004085; border: 1px solid #b8daff;">
            <strong>ℹ️ Info:</strong> Die Kosten werden in Mikrocents gemessen. 1 Dollar = 100.000.000 Mikrocents (µ¢).<br>
            Die Daten zeigen deine monatliche Nutzung über alle Apps hinweg.
        </div>
    `;

    usageContent.innerHTML = html;
}
