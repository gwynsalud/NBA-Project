document.addEventListener('DOMContentLoaded', () => {
    loadOraclePredictions();
});

async function loadOraclePredictions() {
    const grid = document.getElementById('oracle-grid');
    
    try {
        const response = await fetch('../data/predictions.json');
        if (!response.ok) throw new Error('Data not found');
        
        const predictions = await response.json();
        grid.innerHTML = ''; 

        predictions.forEach(item => {
            const prob = item.playoff_probability_percent.toFixed(1);
            const teamAbbr = item.abbr.toLowerCase();
            const teamAbbrUpper = item.abbr.toUpperCase();
            
            // OPTION A: ESPN CDN (Usually more permissive than NBA.com)
            const logoUrl = `https://a.espncdn.com/i/teamlogos/nba/500/${teamAbbr}.png`;
            
            // OPTION B: Fallback (Official NBA CDN if ESPN fails)
            const fallbackUrl = `https://cdn.nba.com/logos/nba/${teamAbbr}/primary/L/logo.svg`;

            const card = document.createElement('div');
            card.className = 'oracle-card';
            
            card.innerHTML = `
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #999; font-size: 10px; font-weight: bold; letter-spacing: 1px;">${item.conference.toUpperCase()}</span>
                    <span class="live-dot" style="color: #00ff00; font-size: 8px; animation: blink 2s infinite;">● LIVE</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 12px; margin: 15px 0;">
                    <div style="height: 40px; width: 40px; display: flex; align-items: center; justify-content: center;">
                        <img src="${logoUrl}" 
                             alt="${item.team}" 
                             style="max-height: 100%; max-width: 100%; filter: drop-shadow(0 0 2px rgba(255,255,255,0.2));"
                             onerror="this.onerror=null; this.src='https://www.nba.com/assets/logos/teams/primary/web/NBA.svg';">
                    </div>
                    <div>
                        <div style="font-size: 16px; font-weight: 800; line-height: 1; color: white;">${teamAbbrUpper}</div>
                        <div style="font-size: 10px; color: #666;">${item.team}</div>
                    </div>
                </div>

                <div style="margin-bottom: 5px;">
                    <span style="font-size: 24px; font-weight: 900; color: white;">${prob}%</span>
                </div>
                
                <div style="background: #333; height: 4px; width: 100%; border-radius: 2px; overflow: hidden;">
                    <div style="background: #1d428a; height: 100%; width: ${prob}%; transition: width 1.5s ease-out;"></div>
                </div>
                <div style="font-size: 9px; color: #555; margin-top: 8px; text-transform: uppercase;">Win Probability Index</div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Oracle Error:", error);
        grid.innerHTML = `<div style="color: #666; padding: 20px;">AI Model Syncing...</div>`;
    }
}