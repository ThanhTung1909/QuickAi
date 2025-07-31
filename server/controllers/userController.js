import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();

    const creations =
      await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

    res.json({
      success: true,
      creations,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getPublishedUserCreations = async (req, res) => {
  try {
    const creations =
      await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;

    res.json({
      success: true,
      creations,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await aql`SELECT * FROM creations WHERE id = ${id}`;

    if (!creation) {
      return res.json({
        success: false,
        message: "Creation not found",
      });
    }

    const currentLike = creation.likes;
    const userIdStr = userId.toString();
    let updateedLikes;
    let message;

    if (currentLike.includes(userIdStr)) {
      updateedLikes = currentLike.filter((user) => user !== userIdStr);
      message = "Creation Unliked";
    } else {
      updateedLikes = [...updateedLikes, userIdStr];
      message = "Creation Liked";
    }

    const formattedArray = `{${updateedLikes.json(",")}}`;

    await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
