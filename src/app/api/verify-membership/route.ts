import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MembershipVerification } from "@/lib/membership-verification";
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const limiter = rateLimit({
      interval: 60000,
      uniqueTokenPerInterval: 500
    });
    
    await limiter.check(request, 10);
    
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "User ID is required" 
      }, { status: 400 });
    }

    const result = await MembershipVerification.verifyAndUpdateMembership(userId);

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
} 