export async function POST(req) {
  try {
    const data = await req.json();
    console.log(data, 'data');

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        videoId: data.videoId,
      },
    });

    if (existingFavorite) {
        return NextResponse.json({ error: 'Favorite already exists' }, { status: 400 });
    }
    
    const newFavorite = await prisma.favorite.create({
      data: {
        title: data.title,
        videoId: data.videoId,
        image: data.image,
        userId: parseInt(data.userId),
      },
    });

    return NextResponse.json(newFavorite, { status: 201 });

} catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error during signup', error: error.message },
      { status: 500 }
    );
  }
}