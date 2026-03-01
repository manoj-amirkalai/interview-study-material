import { Suspense, useState, useRef, useEffect } from 'react';
import './SuspenseImageLazyLoading.css';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ImageItem {
    id: number;
    src: string;
    alt: string;
    placeholder: string;
    size: string;
}

interface LazyImageProps {
    readonly src: string;
    readonly alt: string;
    readonly placeholder?: string;
}

// ============================================================================
// IMAGE LAZY LOADING COMPONENT (with Suspense)
// ============================================================================

function LazyImage({ src, alt, placeholder }: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    img.src = src;
                    img.onload = () => setIsLoaded(true);
                    img.onerror = () => setError(true);
                    observer.unobserve(img);
                }
            },
            { rootMargin: '50px' }
        );

        observer.observe(img);
        return () => observer.disconnect();
    }, [src]);

    return (
        <div className="lazy-image-container">
            <img
                ref={imgRef}
                src={placeholder || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3C/svg%3E'}
                alt={alt}
                className={`lazy-image ${isLoaded ? 'loaded' : 'loading'} ${error ? 'error' : ''}`}
            />
            {!isLoaded && !error && <div className="image-spinner"></div>}
            {error && <div className="image-error">Failed to load image</div>}
        </div>
    );
}

// ============================================================================
// SUSPENSE IMAGE GALLERY (Basic)
// ============================================================================

function ImageGalleryContent() {
    const images: ImageItem[] = [
        {
            id: 1,
            src: 'https://picsum.photos/id/1/300/200',
            alt: 'Mountain landscape',
            placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%234a5568" width="300" height="200"/%3E%3C/svg%3E',
            size: '45KB',
        },
        {
            id: 2,
            src: 'https://picsum.photos/id/10/300/200',
            alt: 'Forest scene',
            placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%235a6a78" width="300" height="200"/%3E%3C/svg%3E',
            size: '52KB',
        },
        {
            id: 3,
            src: 'https://picsum.photos/id/20/300/200',
            alt: 'Beach view',
            placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%236a7a88" width="300" height="200"/%3E%3C/svg%3E',
            size: '48KB',
        },
        {
            id: 4,
            src: 'https://picsum.photos/id/30/300/200',
            alt: 'City skyline',
            placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%237a8a98" width="300" height="200"/%3E%3C/svg%3E',
            size: '50KB',
        },
        {
            id: 5,
            src: 'https://picsum.photos/id/40/300/200',
            alt: 'Desert dunes',
            placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%238a9aA8" width="300" height="200"/%3E%3C/svg%3E',
            size: '46KB',
        },
        {
            id: 6,
            src: 'https://picsum.photos/id/50/300/200',
            alt: 'Lake reflection',
            placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%239aAaB8" width="300" height="200"/%3E%3C/svg%3E',
            size: '51KB',
        },
    ];

    return (
        <div className="image-gallery">
            {images.map(image => (
                <div key={image.id} className="gallery-item">
                    <LazyImage src={image.src} alt={image.alt} placeholder={image.placeholder} />
                    <div className="image-info">
                        <p className="image-name">{image.alt}</p>
                        <p className="image-size">{image.size}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============================================================================
// LOADING FALLBACK COMPONENT
// ============================================================================

function ImageLoadingFallback() {
    return (
        <div className="loading-fallback">
            <div className="skeleton-grid">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="skeleton-item">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-text"></div>
                    </div>
                ))}
            </div>
            <p className="loading-message">Loading images...</p>
        </div>
    );
}

// ============================================================================
// PROGRESSIVE IMAGE LOADING COMPONENT
// ============================================================================

function ProgressiveImageComponent() {
    const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');

    const sizeMap = {
        small: { width: 150, height: 100, url: 'https://picsum.photos/150/100?random=' },
        medium: { width: 300, height: 200, url: 'https://picsum.photos/300/200?random=' },
        large: { width: 600, height: 400, url: 'https://picsum.photos/600/400?random=' },
    };

    const config = sizeMap[selectedSize];

    return (
        <div className="progressive-image-section">
            <h4>Progressive Image Loading</h4>
            <p>Select image size to load (simulates different device resolutions)</p>

            <div className="size-selector">
                {(['small', 'medium', 'large'] as const).map(size => (
                    <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    >
                        {size.toUpperCase()} ({sizeMap[size].width}x{sizeMap[size].height})
                    </button>
                ))}
            </div>

            <div className="progressive-demo">
                <img
                    src={config.url}
                    alt="Progressive loading demo"
                    style={{ width: '100%', maxWidth: config.width }}
                    className="progressive-image"
                />
                <p className="image-dims">
                    {config.width}x{config.height} - {Math.round((config.width * config.height) / 1000)}KB
                </p>
            </div>
        </div>
    );
}

// ============================================================================
// IMAGE OPTIMIZATION STRATEGIES
// ============================================================================

function ImageOptimizationStrategies() {
    const strategies = [
        {
            name: 'Lazy Loading',
            description: 'Load images only when they come into viewport',
            impl: 'IntersectionObserver API',
            benefits: ['Faster initial load', 'Reduced bandwidth', 'Better UX'],
        },
        {
            name: 'Progressive Loading',
            description: 'Load low-quality first, then high-quality',
            impl: 'LQIP (Low Quality Image Placeholder)',
            benefits: ['Perceived speed', 'Progressive enhancement', 'Mobile friendly'],
        },
        {
            name: 'Responsive Images',
            description: 'Serve different sizes for different devices',
            impl: 'srcset and sizes attributes',
            benefits: ['Device optimization', 'Bandwidth savings', 'Better UX'],
        },
        {
            name: 'Format Optimization',
            description: 'Use modern formats (WebP, AVIF)',
            impl: 'Picture element with source tags',
            benefits: ['Better compression', 'Reduced file size', 'Modern browser support'],
        },
    ];

    return (
        <div className="strategies-section">
            <h4>Image Optimization Strategies</h4>
            <div className="strategies-grid">
                {strategies.map((strategy) => (
                    <div key={strategy.name} className="strategy-card">
                        <h5>{strategy.name}</h5>
                        <p className="strategy-desc">{strategy.description}</p>
                        <p className="strategy-impl">Implementation: {strategy.impl}</p>
                        <div className="strategy-benefits">
                            <strong>Benefits:</strong>
                            <ul>
                                {strategy.benefits.map((benefit) => (
                                    <li key={benefit}>✓ {benefit}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// CODE EXAMPLES COMPONENT
// ============================================================================

function CodeExamples() {
    const [activeExample, setActiveExample] = useState(0);

    const examples = [
        {
            title: 'Basic Lazy Loading',
            code: `import { useRef, useEffect, useState } from 'react';

function LazyImage({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        imgRef.current.src = src;
        imgRef.current.onload = () => setIsLoaded(true);
        observer.unobserve(imgRef.current);
      }
    });

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  return (
    <img 
      ref={imgRef}
      alt={alt}
      className={isLoaded ? 'loaded' : 'loading'}
    />
  );
}`,
        },
        {
            title: 'Suspense with Images',
            code: `import { Suspense } from 'react';

function ImageGallery() {
  return (
    <Suspense fallback={<LoadingSkeletons />}>
      <ImageGrid />
    </Suspense>
  );
}

// Component that suspends until all images load
function ImageGrid() {
  const images = preloadImages([...]);
  
  return (
    <div className="grid">
      {images.map(img => (
        <img key={img.id} src={img.src} alt={img.alt} />
      ))}
    </div>
  );
}`,
        },
        {
            title: 'Progressive Image Loading',
            code: `import { useState } from 'react';

function ProgressiveImage({ src, lowQuality }) {
  const [isHQ, setIsHQ] = useState(false);

  return (
    <img
      src={isHQ ? src : lowQuality}
      alt="Progressive"
      onLoad={() => setIsHQ(true)}
      style={{
        filter: isHQ ? 'blur(0)' : 'blur(10px)',
        transition: 'filter 0.3s'
      }}
    />
  );
}`,
        },
        {
            title: 'Responsive Images',
            code: `function ResponsiveImage() {
  return (
    <picture>
      <source
        srcSet="small.webp 480w, medium.webp 768w"
        type="image/webp"
      />
      <source
        srcSet="small.jpg 480w, medium.jpg 768w"
        type="image/jpeg"
      />
      <img
        src="medium.jpg"
        alt="Responsive"
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
      />
    </picture>
  );
}`,
        },
    ];

    return (
        <div className="code-examples-section">
            <h4>Implementation Examples</h4>
            <div className="example-tabs">
                {examples.map((ex) => (
                    <button
                        key={ex.title}
                        onClick={() => setActiveExample(examples.findIndex(e => e.title === ex.title))}
                        className={`tab-btn ${activeExample === examples.findIndex(e => e.title === ex.title) ? 'active' : ''}`}
                    >
                        {ex.title}
                    </button>
                ))}
            </div>
            <pre className="code-block">
                <code>{examples[activeExample].code}</code>
            </pre>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SuspenseImageLazyLoading() {
    return (
        <div className="suspense-lazy-loading-container">
            <header className="section-header">
                <h1>Suspense & Image Lazy Loading</h1>
                <p>
                    Master image optimization with React's Suspense boundaries, lazy loading
                    strategies, and progressive image techniques for optimal performance.
                </p>
            </header>

            {/* Section 1: Suspense with Lazy Loading Gallery */}
            <section className="feature-section">
                <h3>1. Suspense Image Gallery</h3>
                <p className="section-desc">
                    Images load on-demand as they enter the viewport, wrapped in a Suspense boundary
                </p>
                <Suspense fallback={<ImageLoadingFallback />}>
                    <ImageGalleryContent />
                </Suspense>
            </section>

            {/* Section 2: Progressive Image Loading */}
            <section className="feature-section">
                <h3>2. Progressive Image Loading</h3>
                <p className="section-desc">
                    Load responsive images based on device size for optimal performance
                </p>
                <ProgressiveImageComponent />
            </section>

            {/* Section 3: Image Optimization Strategies */}
            <section className="feature-section">
                <h3>3. Optimization Strategies</h3>
                <p className="section-desc">
                    Learn different image optimization techniques and their benefits
                </p>
                <ImageOptimizationStrategies />
            </section>

            {/* Section 4: Code Examples */}
            <section className="feature-section">
                <h3>4. Implementation Examples</h3>
                <p className="section-desc">
                    Copy-ready code for different image loading patterns
                </p>
                <CodeExamples />
            </section>

            {/* Best Practices */}
            <section className="best-practices">
                <h3>📋 Best Practices for Image Loading</h3>
                <div className="practices-grid">
                    <div className="practice-item">
                        <h4>✓ Always Use Placeholders</h4>
                        <p>Provide low-quality placeholders or skeleton screens for better UX</p>
                    </div>
                    <div className="practice-item">
                        <h4>✓ Set Explicit Dimensions</h4>
                        <p>Prevent layout shift by specifying width and height</p>
                    </div>
                    <div className="practice-item">
                        <h4>✓ Use Suspense Boundaries</h4>
                        <p>Group related images in Suspense boundaries for better loading states</p>
                    </div>
                    <div className="practice-item">
                        <h4>✓ Optimize File Sizes</h4>
                        <p>Compress images and use modern formats like WebP and AVIF</p>
                    </div>
                    <div className="practice-item">
                        <h4>✓ Implement Error Handling</h4>
                        <p>Show fallback UI when images fail to load</p>
                    </div>
                    <div className="practice-item">
                        <h4>✓ Use Native Lazy Loading</h4>
                        <p>Combine IntersectionObserver API with native lazy loading attribute</p>
                    </div>
                </div>
            </section>

            {/* Performance Comparison */}
            <section className="performance-section">
                <h3>⚡ Performance Impact</h3>
                <div className="comparison-table">
                    <div className="table-header">
                        <div className="table-cell">Strategy</div>
                        <div className="table-cell">First Paint</div>
                        <div className="table-cell">TTI</div>
                        <div className="table-cell">Data Usage</div>
                    </div>
                    <div className="table-row">
                        <div className="table-cell">No Optimization</div>
                        <div className="table-cell">~3.5s</div>
                        <div className="table-cell">~5.2s</div>
                        <div className="table-cell">~2.5MB</div>
                    </div>
                    <div className="table-row">
                        <div className="table-cell">Lazy Loading</div>
                        <div className="table-cell">~1.2s</div>
                        <div className="table-cell">~2.1s</div>
                        <div className="table-cell">~1.8MB</div>
                    </div>
                    <div className="table-row">
                        <div className="table-cell">Lazy + Responsive</div>
                        <div className="table-cell">~1.0s</div>
                        <div className="table-cell">~1.8s</div>
                        <div className="table-cell">~0.9MB</div>
                    </div>
                    <div className="table-row">
                        <div className="table-cell">Lazy + Responsive + Format</div>
                        <div className="table-cell">~0.8s</div>
                        <div className="table-cell">~1.5s</div>
                        <div className="table-cell">~0.6MB</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
