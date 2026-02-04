async function loadListings() {
    const bigsGrid = document.getElementById('bigs-grid');
    const lilsGrid = document.getElementById('lils-grid');
    
    bigsGrid.innerHTML = '<p class="col-span-full text-center text-gray-400">Loading...</p>';
    lilsGrid.innerHTML = '<p class="col-span-full text-center text-gray-400">Loading...</p>';
    
    try {
        // Call YOUR backend API instead of OpenSea directly
        const response = await fetch('/api/listings');
        const data = await response.json();
        
        // Populate Bigs
        bigsGrid.innerHTML = '';
        data.bigs.forEach(nft => {
            const div = document.createElement('div');
            div.className = 'bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all';
            div.innerHTML = `
                <div class="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-800">
                    ${nft.image ? `<img src="${nft.image}" alt="${nft.name}" class="w-full h-full object-cover">` : '<div class="bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center h-full"><div class="text-8xl">🐧</div></div>'}
                </div>
                <h4 class="font-bold text-white">${nft.name}</h4>
                <div class="flex items-baseline gap-2 my-2">
                    <span class="text-lg font-bold text-green-400">${nft.price.toFixed(2)} ETH</span>
                    <span class="text-sm text-gray-400">$${nft.priceUSD.toFixed(2)}</span>
                </div>
                <button onclick="window.open('https://opensea.io/assets/ethereum/${nft.contract}/${nft.tokenId}', '_blank')" class="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg text-sm font-semibold">Buy on OpenSea</button>
            `;
            bigsGrid.appendChild(div);
        });
        
        // Populate Lils
        lilsGrid.innerHTML = '';
        data.lils.forEach(nft => {
            const div = document.createElement('div');
            div.className = 'bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all';
            div.innerHTML = `
                <div class="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-800">
                    ${nft.image ? `<img src="${nft.image}" alt="${nft.name}" class="w-full h-full object-cover">` : '<div class="bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center h-full"><div class="text-8xl">🐧</div></div>'}
                </div>
                <h4 class="font-bold text-white">${nft.name}</h4>
                <div class="flex items-baseline gap-2 my-2">
                    <span class="text-lg font-bold text-green-400">${nft.price.toFixed(2)} ETH</span>
                    <span class="text-sm text-gray-400">$${nft.priceUSD.toFixed(2)}</span>
                </div>
                <button onclick="window.open('https://opensea.io/assets/ethereum/${nft.contract}/${nft.tokenId}', '_blank')" class="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg text-sm font-semibold">Buy on OpenSea</button>
            `;
            lilsGrid.appendChild(div);
        });
        
        console.log('Listings loaded from backend!');
    } catch (error) {
        console.error('Error loading listings:', error);
        bigsGrid.innerHTML = '<p class="col-span-full text-center text-red-400">Failed to load listings</p>';
        lilsGrid.innerHTML = '<p class="col-span-full text-center text-red-400">Failed to load listings</p>';
    }
}
