import express from "express";
import { getProductDetail, getProducts } from "./api/products.js";
import Redis from 'ioredis';
import { getCachedData, rateLimiter } from "./middleware/redis.js";

const app = express();
export const redis = new Redis({
    host:'redis-10451.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
    port:10451,
    password:'mrlrNaemFhBAN3xMXA43MeIQ7tCscvUk',
});

redis.on("connect", ()=>{
    console.log("Redis connected");
});


app.get("/", rateLimiter(10,60) ,async (req,res)=> {
    // current IP - request count
    res.send(`Hello World! ${req.requestCount}`);
});

app.get("/products", rateLimiter(5,30),getCachedData("products"), async(req,res) => {

    const products = await getProducts();
    await redis.setex("products",20, JSON.stringify(products.products));

    res.json({
        products,
    });
});

app.get("/product/:id", async(req,res) => {
    const id = req.params.id;
    const key = `product:${id}`;

    let product = await redis.get(key);

    if (product)
        return res.json({
        product: JSON.parse(product),
    });

    product = await getProductDetail(id);
    await redis.set(key, JSON.stringify(product));

    res.json({
        product,
    });

});

app.get("/order/:id", async (req,res) => {
    const productId = req.params.id;
    const key = `product:${productId}`;

//  Any Mutation to Database Here
//  Like Creating New Order in Database
//  Reducing the product stock in Database

    await redis.del(key);

    return res.json({
        message:`Order placed successfully, product id:${productId} is ordered.`,
    });
});


app.listen(3000, ()=> {
    console.log("Server is running on port 3000");
});