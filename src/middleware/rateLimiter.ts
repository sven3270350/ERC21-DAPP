import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
const rateLimitMap = new Map();

export default function rateLimitMiddleware(handler: any) {
    return (req: NextRequest, res: NextResponse) => {
        // const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const ip = headers().get("x-forwarded-for");
        const limit = 5; // Limiting requests to 5 per minute per IP
        const windowMs = 60 * 1000; // 1 minute
        
        if (!rateLimitMap.has(ip)) {
            rateLimitMap.set(ip, {
                count: 0,
                lastReset: Date.now(),
            });
        }
        
        const ipData = rateLimitMap.get(ip);
        
        if (Date.now() - ipData.lastReset > windowMs) {
            ipData.count = 0;
            ipData.lastReset = Date.now();
        }
        
        if (ipData.count >= limit) {
            // return res.status(429).send("Too Many Requests");
            return NextResponse.json({ error: "Too Many Requests" }, {
              status: 429
          })
        }
        
        ipData.count += 1;
        
        return handler(req, res);
    };
}