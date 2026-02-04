const OPENSEA_API_KEY = '1ba82dceecf94ec0bb8b966f09eef70a';
let cache = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const now = Date.now();
  if (cache && (now - cacheTime) < CACHE_DURATION) {
    return res.status(200).json(cache);
  }
  
  try {
    const ethRes = await fetch('https://api.diadata.org/v1/assetQuotation/Ethereum/0x0000000000000000000000000000000000000000');
    const ethData = await ethRes.json();
    const ethPrice = ethData.Price;
    
    const pudgyRes = await fetch('https://api.opensea.io/api/v2/listings/collection/pudgypenguins/all?limit=10', {
      headers: {'X-API-KEY': OPENSEA_API_KEY}
    });
    const pudgyListings = await pudgyRes.json();
    
    const lilRes = await fetch('https://api.opensea.io/api/v2/listings/collection/lilpudgys/all?limit=10', {
      headers: {'X-API-KEY': OPENSEA_API_KEY}
    });
    const lilListings = await lilRes.json();
    
    const bigs = [];
    for (const listing of pudgyListings.listings || []) {
      if (bigs.length >= 6) break;
      const priceWei = listing.price?.current?.value;
      if (!priceWei) continue;
      const priceETH = parseFloat(priceWei) / 1e18;
      const tokenId = listing.protocol_data?.parameters?.offer?.[0]?.identifierOrCriteria;
      
      try {
        const nftRes = await fetch(`https://api.opensea.io/api/v2/chain/ethereum/contract/0xBd3531dA5CF5857e7CfAA92426877b022e612cf8/nfts/${tokenId}`, {
          headers: {'X-API-KEY': OPENSEA_API_KEY}
        });
        const nftData = await nftRes.json();
        bigs.push({
          tokenId,
          name: `Pudgy Penguin #${tokenId}`,
          price: priceETH,
          priceUSD: priceETH * ethPrice,
          image: nftData.nft?.image_url,
          contract: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8'
        });
      } catch (e) {}
    }
    
    const lils = [];
    for (const listing of lilListings.listings || []) {
      if (lils.length >= 6) break;
      const priceWei = listing.price?.current?.value;
      if (!priceWei) continue;
      const priceETH = parseFloat(priceWei) / 1e18;
      const tokenId = listing.protocol_data?.parameters?.offer?.[0]?.identifierOrCriteria;
      
      try {
        const nftRes = await fetch(`https://api.opensea.io/api/v2/chain/ethereum/contract/0x524cAB2ec69124574082676e6F654a18df49A048/nfts/${tokenId}`, {
          headers: {'X-API-KEY': OPENSEA_API_KEY}
        });
        const nftData = await nftRes.json();
        lils.push({
          tokenId,
          name: `Lil Pudgy #${tokenId}`,
          price: priceETH,
          priceUSD: priceETH * ethPrice,
          image: nftData.nft?.image_url,
          contract: '0x524cAB2ec69124574082676e6F654a18df49A048'
        });
      } catch (e) {}
    }
    
    const result = { bigs, lils, ethPrice };
    cache = result;
    cacheTime = now;
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
}
