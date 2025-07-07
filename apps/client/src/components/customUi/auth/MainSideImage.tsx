function MainSideImage({ imageURL }: { imageURL: string }) {
  return (
    <div className="h-full w-[60%] relative flex justify-center items-center">
      <img
        className="w-full h-full -left-5 absolute  object-cover scale-90"
        alt="Background left"
        src={imageURL}
      />
    </div>
  );
}

export default MainSideImage;
