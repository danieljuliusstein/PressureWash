if (typeof window.React === 'undefined') {
    console.error("React is not loaded.");
    document.getElementById('root').innerHTML = "<p>Error: Unable to load the page. Please refresh or contact support.</p>";
    throw new Error("React is not defined");
}

if (typeof window.ReactDOM === 'undefined') {
    console.error("ReactDOM is not loaded.");
    document.getElementById('root').innerHTML = "<p>Error: Unable to load the page. Please refresh or contact support.</p>";
    throw new Error("ReactDOM is not defined");
}

if (!window.ReactBootstrap) {
    console.error("ReactBootstrap is not loaded.");
    throw new Error("ReactBootstrap is not defined");
}

const { Nav, Button } = ReactBootstrap;

const useBeforeAfterSlider = (sliderRef) => {
    React.useEffect(() => {
        if (!sliderRef.current) return;

        const slider = sliderRef.current;
        const handle = slider.querySelector('.slider-handle');
        const afterImage = slider.querySelector('.after-image');
        let isDragging = false;
        let lastPercent = 50; // Default to middle
        let rafId = null;

        const updateSliderPosition = (clientX) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const rect = slider.getBoundingClientRect();
                const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
                const percent = (x / rect.width) * 100;
                lastPercent = percent;
                afterImage.style.width = `${percent}%`;
                handle.style.left = `${percent}%`;

                // Toggle label visibility
                if (percent <= 0.1) {
                    slider.classList.add('after-hidden');
                    slider.classList.remove('before-hidden');
                } else if (percent >= 99.9) {
                    slider.classList.add('before-hidden');
                    slider.classList.remove('after-hidden');
                } else {
                    slider.classList.remove('before-hidden', 'after-hidden');
                }
            });
        };

        const handleStart = (e) => {
            e.preventDefault(); // Prevent text selection and scrolling
            isDragging = true;
            slider.classList.add('active');
            const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            updateSliderPosition(clientX);
        };

        const handleMove = (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevent scrolling during touch
            const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            updateSliderPosition(clientX);
        };

        const handleEnd = () => {
            isDragging = false;
            slider.classList.remove('active');
            if (rafId) cancelAnimationFrame(rafId);
        };

        // Prevent default behaviors for images and slider
        const preventDefault = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        slider.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', preventDefault);
            img.addEventListener('selectstart', preventDefault);
            img.addEventListener('contextmenu', preventDefault);
        });

        slider.addEventListener('selectstart', preventDefault);
        slider.addEventListener('contextmenu', preventDefault);

        // Event listeners
        handle.addEventListener('mousedown', handleStart);
        handle.addEventListener('touchstart', handleStart, { passive: false });
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);
        window.addEventListener('touchcancel', handleEnd);

        // Initialize slider position
        afterImage.style.width = `${lastPercent}%`;
        handle.style.left = `${lastPercent}%`;

        return () => {
            handle.removeEventListener('mousedown', handleStart);
            handle.removeEventListener('touchstart', handleStart);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
            window.removeEventListener('touchcancel', handleEnd);
            slider.querySelectorAll('img').forEach(img => {
                img.removeEventListener('dragstart', preventDefault);
                img.removeEventListener('selectstart', preventDefault);
                img.removeEventListener('contextmenu', preventDefault);
            });
            slider.removeEventListener('selectstart', preventDefault);
            slider.removeEventListener('contextmenu', preventDefault);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [sliderRef]);
};

// PressurePage Component
const PressurePage = () => {
    const galleryItems = [
        {
            id: 1,
            type: 'before-after',
            title: 'Driveway Transformation',
            before: 'driveway-before.jpg',
            after: 'driveway-after.jpg',
            description: 'Revitalized driveway with deep cleaning.'
        },
        {
            id: 2,
            type: 'before-after',
            title: 'Patio Revival',
            before: 'patio-before.jpg',
            after: 'patio-after.jpg',
            description: 'Restored patio to its original shine.'
        },
        {
            id: 3,
            type: 'before-after',
            title: 'Deck Restoration',
            before: 'deck-before.jpg',
            after: 'deck-after.jpg',
            description: 'Refreshed deck with eco-friendly solutions.'
        },
        {
            id: 4,
            type: 'single',
            image: 'concrete-cleaning.jpg',
            title: 'Concrete Cleaning',
            description: 'Spotless concrete surfaces.'
        },
        {
            id: 5,
            type: 'single',
            image: 'fence-washing.jpg',
            title: 'Fence Washing',
            description: 'Restored fences to look brand new.'
        }
    ];

    const [selectedImage, setSelectedImage] = React.useState(null);
    const sliderRefs = galleryItems
        .filter(item => item.type === 'before-after')
        .map(() => React.useRef(null));

    galleryItems.forEach((item, index) => {
        if (item.type === 'before-after') {
            useBeforeAfterSlider(sliderRefs[index]);
        }
    });

    return (
        <div>
            <section className="hero pressure-hero">
                <div className="container text-center text-white">
                    <h1 className="display-3 fw-bold animate__animated animate__fadeIn">Professional Pressure Washing</h1>
                    <p className="lead animate__animated animate__fadeIn animate__delay-1s">
                        Transform your property with our eco-friendly, high-performance cleaning services.
                    </p>
                    <button
                        onClick={() => window.dispatchEvent(new Event('openContactForm'))}
                        className="btn btn-lg mt-4 free-quote-btn animate__animated animate__fadeIn animate__delay-2s"
                    >
                        Get a Free Quote
                    </button>
                </div>
            </section>

            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <h2 className="fw-bold mb-4">Expert Pressure Washing Services</h2>
                            <p className="lead mb-4">
                                Our team uses state-of-the-art equipment and eco-friendly solutions to deliver exceptional results for all exterior surfaces.
                            </p>
                            <ul className="list-unstyled">
                                <li className="mb-2"><i className="fas fa-check-circle text-primary me-2"></i> Safe for all surfaces</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-primary me-2"></i> Removes tough stains</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-primary me-2"></i> Enhances property value</li>
                            </ul>
                            <button
                                onClick={() => window.dispatchEvent(new Event('openContactForm'))}
                                className="btn btn-primary mt-4"
                            >
                                Contact Us
                            </button>
                        </div>
                        <div className="col-lg-6">
                            <img
                                src="pressure-washing-overview.jpg"
                                alt="Pressure Washing in Action"
                                className="img-fluid rounded shadow"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">Why Choose Our Services</h2>
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <i className="fas fa-leaf benefit-icon"></i>
                            <h4>Eco-Friendly Solutions</h4>
                            <p>Biodegradable cleaners that are safe for your family, pets, and the environment.</p>
                        </div>
                        <div className="benefit-item">
                            <i className="fas fa-shield-alt benefit-icon"></i>
                            <h4>Fully Insured</h4>
                            <p>Comprehensive insurance and certified technicians for your peace of mind.</p>
                        </div>
                        <div className="benefit-item">
                            <i className="fas fa-clock benefit-icon"></i>
                            <h4>Fast & Efficient</h4>
                            <p>Streamlined processes to deliver results without disrupting your day.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 bg-light">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">Specialized Cleaning Services</h2>
                    <div className="service-grid">
                        <div className="service-item">
                            <div className="service-image">
                                <img src="concrete-cleaning.jpg" alt="Concrete Cleaning" loading="lazy" />
                            </div>
                            <div className="service-content">
                                <h3>Concrete Cleaning</h3>
                                <p>Remove oil, grease, and mildew from driveways and sidewalks.</p>
                                <button
                                    onClick={() => window.dispatchEvent(new Event('openContactForm'))}
                                    className="btn btn-primary mt-3"
                                >
                                    Get a Quote
                                </button>
                            </div>
                        </div>
                        <div className="service-item">
                            <div className="service-image">
                                <img src="fence-cleaning.jpg" alt="Fence Cleaning" loading="lazy" />
                            </div>
                            <div className="service-content">
                                <h3>Fence Cleaning</h3>
                                <p>Restore wood and vinyl fences with our gentle cleaning methods.</p>
                                <button
                                    onClick={() => window.dispatchEvent(new Event('openContactForm'))}
                                    className="btn btn-primary mt-3"
                                >
                                    Get a Quote
                                </button>
                            </div>
                        </div>
                        <div className="service-item">
                            <div className="service-image">
                                <img src="patio-cleaning.jpg" alt="Patio Cleaning" loading="lazy" />
                            </div>
                            <div className="service-content">
                                <h3>Patio Cleaning</h3>
                                <p>Revive your outdoor spaces for family gatherings and relaxation.</p>
                                <button
                                    onClick={() => window.dispatchEvent(new Event('openContactForm'))}
                                    className="btn btn-primary mt-3"
                                >
                                    Get a Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">Before & After Results</h2>
                    <div className="before-after-grid">
                        {galleryItems.filter(item => item.type === 'before-after').map((item, index) => (
                            <div key={item.id} className="before-after-container">
                                <h3 className="text-center mb-3">{item.title}</h3>
                                <div className="image-comparison-slider" ref={sliderRefs[index]}>
                                    <div className="before-image" data-label="Before">
                                        <img
                                            src={item.before}
                                            alt={`Before ${item.title}`}
                                            loading="lazy"
                                            onError={(e) => { e.target.src = 'placeholder.jpg'; }}
                                        />
                                    </div>
                                    <div className="after-image" data-label="After">
                                        <img
                                            src={item.after}
                                            alt={`After ${item.title}`}
                                            loading="lazy"
                                            onError={(e) => { e.target.src = 'placeholder.jpg'; }}
                                        />
                                    </div>
                                    <div className="slider-handle">
                                        <span className="slider-arrow">↔</span>
                                    </div>
                                </div>
                                <p className="text-center mt-3">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-5 bg-light">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">Our Gallery</h2>
                    <div className="gallery-grid">
                        {galleryItems.filter(item => item.type === 'single').map(item => (
                            <div
                                key={item.id}
                                className="gallery-item"
                                onClick={() => setSelectedImage(item)}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    loading="lazy"
                                    onError={(e) => { e.target.src = 'placeholder.jpg'; }}
                                />
                                <div className="gallery-caption">
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedImage && (
                        <div className="gallery-modal" onClick={() => setSelectedImage(null)}>
                            <button className="modal-close">&times;</button>
                            <img src={selectedImage.image} alt={selectedImage.title} />
                            <div className="modal-caption">
                                <h4>{selectedImage.title}</h4>
                                <p>{selectedImage.description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

// HousePage Component (unchanged)
const HousePage = () => {
    return (
        <div>
            <section className="hero service-hero" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('cover-image.png')" }}>
                <div className="container">
                    <h1>House Washing</h1>
                    <p>Restore the Beauty of Your Home with Our Expert House Washing Services</p>
                    <button onClick={() => window.dispatchEvent(new Event('openContactForm'))} className="free-quote-btn">Get a Quote</button>
                </div>
            </section>
            <section className="main-content">
                <div className="content-left">
                    <h2>Professional House Washing Services</h2>
                    <p>
                        Over time, your home’s exterior can accumulate dirt, grime, algae, and mildew, making it look dull and worn. Our house washing services at Jet Stream Pressure Washing are designed to safely and effectively clean your siding, brick, stucco, and other surfaces, restoring your home’s curb appeal.
                    </p>
                    <p>
                        We use a gentle soft washing technique that combines low-pressure water with eco-friendly cleaning solutions to remove stains without damaging your home’s exterior. Whether you’re preparing to sell your home or just want to refresh its appearance, our team is here to help.
                    </p>
                    <p>
                        <strong>Benefits of House Washing:</strong>
                        <ul>
                            <li>Enhances curb appeal and property value.</li>
                            <li>Removes harmful mold, mildew, and algae.</li>
                            <li>Protects your siding from long-term damage.</li>
                        </ul>
                    </p>
                    <button onClick={() => window.dispatchEvent(new Event('openContactForm'))} className="btn-primary">Contact Us Today</button>
                </div>
                <div className="content-right">
                    <img src="/house-washing-image.jpg" alt="House Washing Before and After" />
                </div>
            </section>
        </div>
    );
};

// RoofPage Component (unchanged)
const RoofPage = () => {
    return (
        <div>
            <section className="hero service-hero" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('cover-image.png')" }}>
                <div className="container">
                    <h1>Roof Cleaning</h1>
                    <p>Extend the Life of Your Roof with Safe and Effective Cleaning</p>
                    <button onClick={() => window.dispatchEvent(new Event('openContactForm'))} className="free-quote-btn">Get a Quote</button>
                </div>
            </section>
            <section className="main-content">
                <div className="content-left">
                    <h2>Safe Roof Cleaning Services</h2>
                    <p>
                        Your roof is constantly exposed to the elements, leading to the buildup of algae, moss, lichen, and debris that can cause damage over time. At Jet Stream Pressure Washing, we specialize in safe roof cleaning using soft washing techniques to gently remove these contaminants without harming your shingles.
                    </p>
                    <p>
                        Our eco-friendly cleaning solutions effectively kill mold and algae, preventing regrowth and extending the lifespan of your roof. A clean roof not only looks great but also protects your home from leaks and structural damage.
                    </p>
                    <p>
                        <strong>Benefits of Roof Cleaning:</strong>
                        <ul>
                            <li>Prevents damage to shingles and roofing materials.</li>
                            <li>Improves energy efficiency by removing heat-absorbing debris.</li>
                            <li>Enhances the overall appearance of your home.</li>
                        </ul>
                    </p>
                    <button onClick={() => window.dispatchEvent(new Event('openContactForm'))} className="btn-primary">Contact Us Today</button>
                </div>
                <div className="content-right">
                    <img src="/roof-cleaning-image.jpg" alt="Roof Cleaning Before and After" />
                </div>
            </section>
        </div>
    );
};

// WindowPage Component (unchanged)
const WindowPage = () => {
    return (
        <div>
            <section className="hero service-hero" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('cover-image.png')" }}>
                <div className="container">
                    <h1>Window Cleaning</h1>
                    <p>Crystal Clear Windows for a Brighter Home</p>
                    <button onClick={() => window.dispatchEvent(new Event('openContactForm'))} className="free-quote-btn">Get a Quote</button>
                </div>
            </section>
            <section className="main-content">
                <div className="content-left">
                    <h2>Professional Window Cleaning Services</h2>
                    <p>
                        Dirty windows can detract from your home’s appearance and block natural light. At Jet Stream Pressure Washing, we offer professional window cleaning services to make your windows sparkle inside and out. Our team uses specialized tools and eco-friendly cleaning solutions to remove dirt, smudges, and streaks.
                    </p>
                    <p>
                        We clean both the interior and exterior of your windows, ensuring a spotless finish that enhances your view and brightens your home. Whether it’s a single-story home or a multi-story building, we have the expertise to get the job done safely and efficiently.
                    </p>
                    <p>
                        <strong>Benefits of Window Cleaning:</strong>
                        <ul>
                            <li>Improves natural light and visibility.</li>
                            <li>Enhances the aesthetic appeal of your home.</li>
                            <li>Removes dirt and debris that can damage glass over time.</li>
                        </ul>
                    </p>
                    <button onClick={() => window.dispatchEvent(new Event('openContactForm'))} className="btn-primary">Contact Us Today</button>
                </div>
                <div className="content-right">
                    <img src="/window-cleaning-image.jpg" alt="Window Cleaning in Progress" />
                </div>
            </section>
        </div>
    );
};

// TestimonialsSection (unchanged)
const TestimonialsSection = ({ currentIndex, prevTestimonial, nextTestimonial, testimonials }) => {
    const visibleTestimonials = [];
    const numToShow = Math.min(3, testimonials.length);
    for (let i = 0; i < numToShow; i++) {
        const index = (currentIndex + i) % testimonials.length;
        visibleTestimonials.push(testimonials[index]);
    }

    return (
        <section id="testimonials" className="py-5 bg-light">
            <div className="container">
                <h2 className="text-center mb-5 fw-bold">What Our Customers Say</h2>
                <div className="carousel-wrapper position-relative">
                    <Button className="carousel-btn carousel-btn-left" onClick={prevTestimonial} aria-label="Previous testimonial">
                        <i className="fas fa-chevron-left"></i>
                    </Button>
                    <div className="row g-4 justify-content-center">
                        {visibleTestimonials.map((testimonial, index) => (
                            <div key={index} className="col-md-4 col-sm-6 col-10">
                                <div className="infobox testimonial-card h-100">
                                    <p className="flex-grow-1">"{testimonial.quote}"</p>
                                    <div>
                                        <h5>– {testimonial.author}</h5>
                                        <p>
                                            {Array(Math.floor(testimonial.rating))
                                                .fill()
                                                .map((_, i) => (
                                                    <i key={i} className="fas fa-star text-warning"></i>
                                                ))}
                                            {testimonial.rating % 1 !== 0 && (
                                                <i className="fas fa-star-half-alt text-warning"></i>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button className="carousel-btn carousel-btn-right" onClick={nextTestimonial} aria-label="Next testimonial">
                        <i className="fas fa-chevron-right"></i>
                    </Button>
                </div>
            </div>
        </section>
    );
};

// FAQSection (unchanged)
const FAQSection = () => (
    <section id="faq" className="py-5">
        <div className="container">
            <h2 className="text-center mb-5 fw-bold">Frequently Asked Questions</h2>
            <div className="accordion" id="faqAccordion">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="true"
                            aria-controls="collapseOne"
                        >
                            How long does pressure washing take?
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                        <div className="accordion-body">
                            It depends on the size of the area, but most jobs are completed within a few hours.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseTwo"
                            aria-expanded="false"
                            aria-controls="collapseTwo"
                        >
                            Is pressure washing safe for my siding?
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div className="accordion-body">
                            Yes, we use gentle techniques and eco-friendly products to ensure no damage.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseThree"
                            aria-expanded="false"
                            aria-controls="collapseThree"
                        >
                            Is pressure washing environmentally friendly?
                        </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div className="accordion-body">
                            We do our best to protect the environment by using safe detergents and minimizing water runoff.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseFour"
                            aria-expanded="false"
                            aria-controls="collapseFour"
                        >
                            What’s soft washing and when is it used?
                        </button>
                    </h2>
                    <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div className="accordion-body">
                            Soft washing uses low pressure and specialized cleaning solutions to safely clean delicate surfaces like roofs, stucco, and painted wood without causing damage.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFive">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseFive"
                            aria-expanded="false"
                            aria-controls="collapseFive"
                        >
                            Do you offer recurring maintenance plans?
                        </button>
                    </h2>
                    <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div className="accordion-body">
                            Yes! We can schedule seasonal or annual cleanings to keep your property looking its best year-round.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Chatbot (unchanged)
const Chatbot = () => {
    const [chatOpen, setChatOpen] = React.useState(false);
    const [messages, setMessages] = React.useState([
        {
            sender: 'bot',
            text: (
                <div>
                    Hi! Welcome to Jet Stream Pressure Washing! How can I assist you today?<br />
                    <ul className="list-unstyled mt-2">
                        <li>
                            <button
                                className="btn btn-outline-primary w-100 text-start mb-2"
                                onClick={() => handlePredefinedQuestion('What services do you offer?')}
                                aria-label="Ask about services"
                            >
                                <i className="fas fa-concierge-bell me-2"></i> What services do you offer?
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-outline-primary w-100 text-start mb-2"
                                onClick={() => handlePredefinedQuestion('How do I book a service?')}
                                aria-label="Ask about booking a service"
                            >
                                <i className="fas fa-calendar-check me-2"></i> How do I book a service?
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-outline-primary w-100 text-start mb-2"
                                onClick={() => handlePredefinedQuestion('What’s your cancellation policy?')}
                                aria-label="Ask about cancellation policy"
                            >
                                <i className="fas fa-times-circle me-2"></i> What’s your cancellation policy?
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-outline-primary w-100 text-start mb-2"
                                onClick={() => handlePredefinedQuestion('What are your operating hours?')}
                                aria-label="Ask about operating hours"
                            >
                                <i className="fas fa-clock me-2"></i> What are your operating hours?
                            </button>
                        </li>
                    </ul>
                </div>
            ),
        },
    ]);
    const messagesEndRef = React.useRef(null);

    const toggleChat = () => setChatOpen(!chatOpen);

    const showMainMenu = () => {
        setMessages([
            {
                sender: 'bot',
                text: (
                    <div>
                        Hi! Welcome to Jet Stream Pressure Washing! How can I assist you today?<br />
                        <ul className="list-unstyled mt-2">
                            <li>
                                <button
                                    className="btn btn-outline-primary w-100 text-start mb-2"
                                    onClick={() => handlePredefinedQuestion('What services do you offer?')}
                                    aria-label="Ask about services"
                                >
                                    <i className="fas fa-concierge-bell me-2"></i> What services do you offer?
                                </button>
                            </li>
                            <li>
                                <button
                                    className="btn btn-outline-primary w-100 text-start mb-2"
                                    onClick={() => handlePredefinedQuestion('How do I book a service?')}
                                    aria-label="Ask about booking a service"
                                >
                                    <i className="fas fa-calendar-check me-2"></i> How do I book a service?
                                </button>
                            </li>
                            <li>
                                <button
                                    className="btn btn-outline-primary w-100 text-start mb-2"
                                    onClick={() => handlePredefinedQuestion('What’s your cancellation policy?')}
                                    aria-label="Ask about cancellation policy"
                                >
                                    <i className="fas fa-times-circle me-2"></i> What’s your cancellation policy?
                                </button>
                            </li>
                            <li>
                                <button
                                    className="btn btn-outline-primary w-100 text-start mb-2"
                                    onClick={() => handlePredefinedQuestion('What are your operating hours?')}
                                    aria-label="Ask about operating hours"
                                >
                                    <i className="fas fa-clock me-2"></i> What are your operating hours?
                                </button>
                            </li>
                        </ul>
                    </div>
                ),
            },
        ]);
    };

    const handlePredefinedQuestion = (question) => {
        const predefinedResponses = {
            'What services do you offer?': 'We provide driveway cleaning, house washing, and deck & patio cleaning using eco-friendly solutions to ensure a spotless finish.',
            'How do I book a service?': (
                <div>
                    You can book a service by filling out the contact form on our website. Click the button below to get started!<br />
                    <button className="btn btn-primary mt-2" onClick={() => {
                        showMainMenu();
                        window.dispatchEvent(new Event('openContactForm'));
                    }}>
                        Open Contact Form
                    </button>
                </div>
            ),
            'What’s your cancellation policy?': 'You can cancel your booking up to 24 hours before the scheduled service with no charge. Cancellations within 24 hours may incur a fee.',
            'What are your operating hours?': 'We’re open Monday to Friday, 8:00 AM to 6:00 PM.',
        };

        setMessages((prev) => [
            ...prev,
            { sender: 'user', text: question },
            { sender: 'bot', text: predefinedResponses[question] },
            {
                sender: 'bot',
                text: (
                    <div>
                        <button className="btn btn-outline-secondary w-100 text-start mt-2" onClick={showMainMenu}>
                            <i className="fas fa-arrow-left me-2"></i> Back to Main Menu
                        </button>
                    </div>
                ),
            },
        ]);
    };

    React.useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={`chatbot ${chatOpen ? 'open' : ''}`}>
            <button className="chatbot-toggle btn btn-primary" onClick={toggleChat} aria-label="Toggle chat">
                <i className="fas fa-comment-dots"></i>
            </button>
            {chatOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header d-flex align-items-center">
                        <img src="logo.png" alt="Jet Stream Pressure Washing Logo" className="chatbot-logo me-2" />
                        <span>Jet Stream Pressure Washing</span>
                        <button className="btn btn-close btn-close-white ms-auto" onClick={toggleChat} aria-label="Close chat"></button>
                    </div>
                    <div className="chatbot-body">
                        <div className="chat-messages" style={{ maxHeight: '300px', overflowY: 'auto' }} ref={messagesEndRef}>
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message ${msg.sender === 'user' ? 'text-end' : 'text-start'} mb-2`}
                                >
                                    <span
                                        className={`d-inline-block p-2 rounded ${
                                            msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'
                                        }`}
                                    >
                                        {msg.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ContactPopup (unchanged)
const ContactPopup = ({ isOpen, onClose }) => {
    const [formData, setFormData] = React.useState({ name: '', email: '', phone: '', message: '' });
    const [errors, setErrors] = React.useState({});
    const [submissionStatus, setSubmissionStatus] = React.useState(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters long';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        const phoneRegex = /^\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number (e.g., 123-456-7890)';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus(null);

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch('https://formspree.io/f/mdkebwlr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            setSubmissionStatus('success');
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmissionStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});
        setSubmissionStatus(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="contact-popup-overlay">
            <div className="contact-popup">
                <button className="contact-popup-close" onClick={handleClose} aria-label="Close contact form">
                    <i className="fas fa-times"></i>
                </button>
                <h2 className="contact-popup-header">Get a Free Quote</h2>

                {submissionStatus === 'success' ? (
                    <div className="alert alert-success text-center" role="alert">
                        <h4 className="alert-heading">Thank You!</h4>
                        <p>We’ve received your request. Our team will contact you within 24 hours.</p>
                        <button className="btn btn-primary mt-3" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                ) : submissionStatus === 'error' ? (
                    <div className="alert alert-danger text-center" role="alert">
                        <h4 className="alert-heading">Oops!</h4>
                        <p>Something went wrong. Please try again later or contact us directly at (678) 697-1957.</p>
                        <button className="btn btn-primary mt-3" onClick={() => setSubmissionStatus(null)}>
                            Try Again
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                aria-describedby="nameError"
                                required
                            />
                            {errors.name && (
                                <div id="nameError" className="invalid-feedback">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Your Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Your Email"
                                aria-describedby="emailError"
                                required
                            />
                            {errors.email && (
                                <div id="emailError" className="invalid-feedback">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">
                                Your Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="123-456-7890"
                                aria-describedby="phoneError"
                                required
                            />
                            {errors.phone && (
                                <div id="phoneError" className="invalid-feedback">
                                    {errors.phone}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="message" className="form-label">
                                Tell us about your project
                            </label>
                            <textarea
                                id="message"
                                className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us about your project"
                                rows="4"
                                aria-describedby="messageError"
                                required
                            ></textarea>
                            {errors.message && (
                                <div id="messageError" className="invalid-feedback">
                                    {errors.message}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isSubmitting}
                            aria-label="Submit contact form"
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin me-2"></i>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Request'
                            )}
                        </button>

                        <div className="recaptcha-badge mt-3 d-flex align-items-center justify-content-center">
                            <img
                                src="recaptcha-icon.png"
                                alt="reCAPTCHA Logo"
                                style={{ width: '20px', height: '20px', marginRight: '5px' }}
                            />
                            <span className="recaptcha-text">
                                Protected by reCAPTCHA -{' '}
                                <a
                                    href="https://policies.google.com/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="recaptcha-link"
                                >
                                    Privacy
                                </a>{' '}
                                -{' '}
                                <a
                                    href="https://policies.google.com/terms"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="recaptcha-link"
                                >
                                    Terms
                                </a>
                            </span>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// App Component
const App = ({ mainContent }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isContactPopupOpen, setIsContactPopupOpen] = React.useState(false);
    const [isNavbarTransparent, setIsNavbarTransparent] = React.useState(true);
    const [menuOpen, setMenuOpen] = React.useState(false);

    const testimonials = [
        { quote: "My driveway looks brand new! Amazing service.", author: "Sarah T.", rating: 5 },
        { quote: "Professional and fast. Highly recommend!", author: "Mike R.", rating: 4.5 },
        { quote: "The deck cleaning exceeded my expectations.", author: "Emily K.", rating: 5 },
        { quote: "Transformed my patio in no time!", author: "John D.", rating: 4.8 },
        { quote: "Best pressure washing I’ve ever had.", author: "Lisa P.", rating: 5 },
        { quote: "The team was courteous and efficient.", author: "Tom H.", rating: 4.7 },
        { quote: "My siding looks pristine again!", author: "Rachel W.", rating: 5 },
        { quote: "Affordable and top-quality service.", author: "Greg M.", rating: 4.6 },
        { quote: "Revived my fence beautifully.", author: "Kelly S.", rating: 4.9 }
    ];

    const serviceAreas = [
        "Buford, GA",
        "Suwanee, GA",
        "Cumming, GA",
        "Lawrenceville, GA"
    ];

    const toggleMenu = () => setMenuOpen(prev => !prev);

    const openContactPopup = (e) => {
        if (e) e.stopPropagation();
        setIsContactPopupOpen(true);
        setMenuOpen(false);
    };

    const closeContactPopup = () => setIsContactPopupOpen(false);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    React.useEffect(() => {
        const handleScroll = () => {
            setIsNavbarTransparent(window.scrollY < 50);
        };
        window.addEventListener('scroll', handleScroll);

        if (typeof $ === 'undefined') {
            console.error("jQuery is not loaded.");
            throw new Error("jQuery is not defined");
        }

        $(document).ready(() => {
            $('.work-item').hide().fadeIn(1000);
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        $(entry.target).animate({ opacity: 1 }, 500);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('#work .work-item').forEach((item) => {
            item.style.opacity = 0;
            observer.observe(item);
        });

        const interval = setInterval(nextTestimonial, 5000);
        window.addEventListener('openContactForm', (e) => openContactPopup(e));

        const initMap = async () => {
            try {
                const { Map } = await google.maps.importLibrary("maps");
                const map = new Map(document.getElementById("service-areas-map"), {
                    center: { lat: 34.1300, lng: -84.0710 },
                    zoom: 10,
                    mapTypeControl: false,
                    styles: [
                        {
                            featureType: "administrative",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#3a86ff" }, { weight: 2 }]
                        },
                        {
                            featureType: "landscape",
                            elementType: "all",
                            stylers: [{ color: "#f5f5f5" }]
                        },
                        {
                            featureType: "water",
                            elementType: "all",
                            stylers: [{ color: "#e3f2fd" }]
                        }
                    ]
                });
        
                // Service area coordinates
                const serviceArea = new google.maps.Polygon({
                    paths: [
                        { lat: 34.2283, lng: -84.1271 }, // Buford
                        { lat: 34.0515, lng: -84.0712 }, // Suwanee
                        { lat: 34.2073, lng: -84.1402 }, // Cumming
                        { lat: 33.9562, lng: -83.9879 }  // Lawrenceville
                    ],
                    strokeColor: "#007bff",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#007bff",
                    fillOpacity: 0.2
                });
        
                serviceArea.setMap(map);
        
                // Add markers for service areas
                const locations = [
                    { lat: 34.2283, lng: -84.1271, name: "Buford" },
                    { lat: 34.0515, lng: -84.0712, name: "Suwanee" },
                    { lat: 34.2073, lng: -84.1402, name: "Cumming" },
                    { lat: 33.9562, lng: -83.9879, name: "Lawrenceville" }
                ];
        
                locations.forEach(location => {
                    new google.maps.Marker({
                        position: { lat: location.lat, lng: location.lng },
                        map: map,
                        title: location.name,
                        animation: google.maps.Animation.DROP
                    });
                });
        
            } catch (error) {
                console.error("Failed to initialize Google Maps:", error);
                const mapContainer = document.getElementById("service-areas-map");
                if (mapContainer) {
                    mapContainer.innerHTML = "<p>Unable to load the map. Please try again later.</p>";
                }
            }
        };

        const loadGoogleMapsScript = () => {
            if (window.google && window.google.maps) {
                initMap();
                return;
            }

            window.initMap = initMap;
            const script = document.createElement("script");
            script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyATdZfeBeV2P4HNGKrkiPsoj7KniCr_QfY&libraries=maps";
            script.async = true;
            script.defer = true;
            script.onerror = () => {
                console.error("Failed to load Google Maps script.");
                const mapContainer = document.getElementById("service-areas-map");
                if (mapContainer) {
                    mapContainer.innerHTML = "<p>Unable to load the map. Please try again later.</p>";
                }
            };
            document.head.appendChild(script);
        };

        loadGoogleMapsScript();

        return () => {
            clearInterval(interval);
            window.removeEventListener('openContactForm', openContactPopup);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>
            <nav className={`navbar navbar-dark bg-black sticky-top ${isNavbarTransparent ? 'navbar-transparent' : 'navbar-opaque'}`}>
                <div className="container">
                    <a className="navbar-brand" href="index.html">
                        <img src="logo.png" alt="Jet Stream Pressure Washing Logo" loading="lazy" />
                    </a>

                    <button
                        className={`hamburger ${menuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle navigation"
                    >
                        <span className="hamburger-icon"></span>
                    </button>

                    <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
                        <div className="mobile-nav-content">
                            <button className="close-btn" onClick={toggleMenu} aria-label="Close navigation">
                                <i className="fas fa-times"></i>
                            </button>
                            <Nav className="flex-column">
                                <Nav.Link href="index.html#home" onClick={toggleMenu}>Home</Nav.Link>
                                <Nav.Link href="index.html#services" onClick={toggleMenu}>Services</Nav.Link>
                                <Nav.Link href="index.html#work" onClick={toggleMenu}>Our Work</Nav.Link>
                                <Nav.Link href="index.html#about" onClick={toggleMenu}>About</Nav.Link>
                                <Nav.Link href="#" onClick={(e) => { openContactPopup(e); toggleMenu(); }}>Contact</Nav.Link>
                            </Nav>
                        </div>
                    </div>

                    <Nav className="nav-menu ms-auto">
                        <Nav.Link href="index.html#home">Home</Nav.Link>
                        <Nav.Link href="index.html#services">Services</Nav.Link>
                        <Nav.Link href="index.html#work">Our Work</Nav.Link>
                        <Nav.Link href="index.html#about">About</Nav.Link>
                        <Nav.Link href="#" onClick={openContactPopup}>Contact</Nav.Link>
                    </Nav>
                </div>
            </nav>

            {menuOpen && <div className="mobile-nav-overlay" onClick={toggleMenu} />}

            {mainContent || (
                <>
                    <section id="home" className="hero text-center text-white">
                        <div className="container py-5">
                            <h1 className="display-4 fw-bold">Jet Stream Pressure Washing</h1>
                            <p className="lead">
                                Jet Stream Pressure Washing provides top-notch cleaning services for residential and commercial properties
                            </p>
                            <button onClick={(e) => openContactPopup(e)} className="btn btn-lg mt-3 free-quote-btn">
                                Get a Free Quote
                            </button>
                        </div>
                    </section>

                    <section id="services" className="py-5">
                        <div className="container">
                            <h2 className="text-center mb-5 fw-bold">Our Premium Services</h2>
                            <div className="row g-4">
                                <div className="col-md-4">
                                    <div className="infobox h-100">
                                        <i className="fas fa-road fa-3x infobox-icon"></i>
                                        <h4>Driveway Cleaning</h4>
                                        <p>Blast away oil stains, dirt, and grime with eco-friendly solutions.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="infobox h-100">
                                        <i className="fas fa-home fa-3x infobox-icon"></i>
                                        <h4>House Washing</h4>
                                        <p>Gentle yet powerful cleaning to refresh your siding and brick.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="infobox h-100">
                                        <i className="fas fa-umbrella-beach fa-3x infobox-icon"></i>
                                        <h4>Deck & Patio Cleaning</h4>
                                        <p>Revive your outdoor spaces for relaxation and entertainment.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="work" className="py-5 bg-light">
                        <div className="container">
                            <h3 className="text-center mb-2 text-primary">What We Are Best At</h3>
                            <h2 className="text-center mb-5 fw-bold">Our Work</h2>
                            <div className="work-grid">
                                <a href="pressure.html" className="work-item pressure-washing">
                                    <div className="work-overlay">
                                        <h3>Pressure Washing</h3>
                                    </div>
                                </a>
                                <a href="window.html" className="work-item window-cleaning">
                                    <div className="work-overlay">
                                        <h3>Window Cleaning</h3>
                                    </div>
                                </a>
                                <a href="roof.html" className="work-item roof-cleaning">
                                    <div className="work-overlay">
                                        <h3>Roof Cleaning</h3>
                                    </div>
                                </a>
                                <a href="house.html" className="work-item house-washing">
                                    <div className="work-overlay">
                                        <h3>House Washing</h3>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </section>

                    <TestimonialsSection
                        currentIndex={currentIndex}
                        prevTestimonial={prevTestimonial}
                        nextTestimonial={nextTestimonial}
                        testimonials={testimonials}
                    />

                    <section id="about" className="py-5">
                        <div className="container">
                            <h2 className="text-center mb-5 fw-bold">Why Choose Us?</h2>
                            <div className="row">
                                <div className="col-md-6">
                                    <p><i className="fas fa-check-circle text-success me-2"></i> Over 10 years of experience.</p>
                                    <p><i className="fas fa-check-circle text-success me-2"></i> Fully insured and licensed.</p>
                                </div>
                                <div className="col-md-6">
                                    <p><i className="fas fa-check-circle text-success me-2"></i> Eco-friendly products.</p>
                                    <p><i className="fas fa-check-circle text-success me-2"></i> 100% satisfaction guarantee.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <FAQSection />

                    <section id="service-areas" className="py-5 bg-light">
                        <div className="container">
                            <h2 className="text-center mb-5 fw-bold">Areas We Serve</h2>
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <div id="service-areas-map" style={{ height: '300px', width: '100%', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}></div>
                                </div>
                                <div className="col-md-6">
                                    <h4 className="mb-4">We proudly serve the following areas:</h4>
                                    <ul className="list-unstyled">
                                        {serviceAreas.map((area, index) => (
                                            <li key={index} className="mb-2">
                                                <i className="fas fa-map-marker-alt text-primary me-2"></i>
                                                {area}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-muted">
                                        Not sure if we serve your area? Contact us to find out!
                                    </p>
                                    <button onClick={(e) => openContactPopup(e)} className="btn btn-primary">
                                        Contact Us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            <footer className="py-5 bg-dark text-white">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 col-sm-6 mb-4">
                            <h5 className="text-uppercase mb-3">Company</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><a href="index.html#home" className="text-white text-decoration-none">Home</a></li>
                                <li className="mb-2"><a href="index.html#work" className="text-white text-decoration-none">Galleries</a></li>
                                <li className="mb-2"><a href="index.html#testimonials" className="text-white text-decoration-none">Reviews</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-4">
                            <h5 className="text-uppercase mb-3">Services</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><a href="pressure.html" className="text-white text-decoration-none">Pressure Washing</a></li>
                                <li className="mb-2"><a href="window.html" className="text-white text-decoration-none">Window Cleaning</a></li>
                                <li className="mb-2"><a href="roof.html" className="text-white text-decoration-none">Roof Cleaning</a></li>
                                <li className="mb-2"><a href="house.html" className="text-white text-decoration-none">House Washing</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-4">
                            <h5 className="text-uppercase mb-3">Service Areas</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2">Buford, GA</li>
                                <li className="mb-2">Suwanee, GA</li>
                                <li className="mb-2">Cumming, GA</li>
                                <li className="mb-2">Lawrenceville, GA</li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-4">
                            <h5 className="text-uppercase mb-3">Hours</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2">Mon: 8:00am – 6:00pm</li>
                                <li className="mb-2">Tue: 8:00am – 6:00pm</li>
                                <li className="mb-2">Wed: 8:00am – 6:00pm</li>
                                <li className="mb-2">Thu: 8:00am – 6:00pm</li>
                                <li className="mb-2">Fri: 8:00am – 6:00pm</li>
                            </ul>
                        </div>
                    </div>
                    <hr className="border-light" />
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <img
                                src="logo.png"
                                alt="Jet Stream Pressure Washing Logo"
                                className="footer-logo mb-3"
                                style={{ maxWidth: '150px' }}
                            />
                            <p className="mb-0">
                                Jet Stream Pressure Washing<br />
                                3139 Cedar Glade ln, Buford, GA 30519, US<br />
                                <a href="mailto:jetstrmpressurewash@gmail.com" className="text-white">
                                    jetstrmpressurewash@gmail.com
                                </a>
                            </p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <p className="mb-2">© 2025 Jet Stream Pressure Washing. All rights reserved.</p>
                            <div className="social-icons">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="https://plus.google.com" target="_blank" rel="noopener noreferrer" className="text-white">
                                    <i className="fab fa-google-plus-g"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <Chatbot />
            <ContactPopup isOpen={isContactPopupOpen} onClose={closeContactPopup} />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
const path = window.location.pathname;

try {
    if (path.includes('house.html')) {
        root.render(<App mainContent={<HousePage />} />);
    } else if (path.includes('pressure.html')) {
        root.render(<App mainContent={<PressurePage />} />);
    } else if (path.includes('roof.html')) {
        root.render(<App mainContent={<RoofPage />} />);
    } else if (path.includes('window.html')) {
        root.render(<App mainContent={<WindowPage />} />);
    } else {
        root.render(<App />);
    }
} catch (error) {
    console.error("Error rendering the application:", error);
    document.getElementById('root').innerHTML = "<p>An error occurred while loading the page. Please try again later.</p>";
}