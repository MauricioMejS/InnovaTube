import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';

export async function POST(req) {
  try {
    const data = await req.json();
    console.log(data, 'data');
    
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

  
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        surename: data.surename,
      },
    });

    // Token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Cookie
    const cookieSerialized = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

 
    const response = NextResponse.json(newUser, { status: 201 });
    response.headers.set('Set-Cookie', cookieSerialized);
    response.headers.set('id', newUser.id);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error during signup', error: error.message },
      { status: 500 }
    );
  }
}
