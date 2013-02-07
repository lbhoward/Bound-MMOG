function Animation(animType, startFrame, endFrame)
{
	this.animType = animType;
	this.startFrame = startFrame;
	this.endFrame = endFrame;
	this.totalFrames = endFrame - startFrame;
}