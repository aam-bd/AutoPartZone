import NodeCache from "node-cache";

const productCache = new NodeCache({ stdTTL: 300 });

export default productCache;
