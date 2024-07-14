import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';

export async function POST(req) {
  try {
    const data = await req.json();
    console.log(data, 'data');

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }


    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });


    const cookieSerialized = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    const response = NextResponse.json({ message: 'Login exitoso', user }, { status: 200 });
    response.headers.set('Set-Cookie', cookieSerialized);
    response.headers.set('id', user.id);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error durante el login', error: error.message },
      { status: 500 }
    );
  }
}
