
"use client"

const HeroSection = () => {
  const scrollToExploreCollections = () => {
    const exploreSection = document.getElementById('explore-collections');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={scrollToExploreCollections}
    >
      {/* Single Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(/hero_image_optimized.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>
    </section>
  )
}

export default HeroSection
