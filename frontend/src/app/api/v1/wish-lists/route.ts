import {NextRequest} from "next/server";

const temporaryWishList: { [userId: string]: number[] } ={
    "user1": [1, 2, 3],
    "user2": [1, 3]
};

export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
        return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }

    const wishList = temporaryWishList[userId] || [];
    return new Response(JSON.stringify(wishList), {
        headers: { "Content-Type": "application/json" },
        status: 200
    });
}

export async function POST(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get("userId");
    const { productId } = await request.json();

    if (!userId || !productId) {
        return new Response(JSON.stringify({ error: "User ID and Product ID are required" }), { status: 400 });
    }

    if (!temporaryWishList[userId]) {
        temporaryWishList[userId] = [];
    }

    if (!temporaryWishList[userId].includes(productId)) {
        temporaryWishList[userId].push(productId);
    }

    return new Response(JSON.stringify({ message: "Product added to wish list" }), {
        headers: { "Content-Type": "application/json" },
        status: 201
    });
}

export async function DELETE(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get("userId");
    const { productId } = await request.json();

    if (!userId || !productId) {
        return new Response(JSON.stringify({ error: "User ID and Product ID are required" }), { status: 400 });
    }

    if (temporaryWishList[userId]) {
        temporaryWishList[userId] = temporaryWishList[userId].filter(id => id !== productId);
    }

    return new Response(JSON.stringify({ message: "Product removed from wish list" }), {
        headers: { "Content-Type": "application/json" },
        status: 200
    });
}