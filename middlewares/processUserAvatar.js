import Jimp from "jimp";
import fs from "fs/promises";
import path from "path";

const processUserAvatar = async (req, res, next) => {
	const { path: tmpDir, filename } = req.file;

	try {
		const avatarPath = path.resolve("public", "avatars", filename);
		const avatar = await Jimp.read(tmpDir);

		await avatar.resize(250, 250).writeAsync(avatarPath);
		next();
	} catch (error) {
		next(error);
	} finally {
		await fs.unlink(tmpDir);
	}
};

export default processUserAvatar;
