import { Route, Routes } from 'react-router-dom';
import './App.css';
import DragAndDrop from './components/DragAndDrop/DragAndDrop';
import AllFeatures from './components/AllFeatures/AllFeatures';
import MenuBar from './components/MenuBar/MenuBar';
import InfiniteScroll from './components/InfiniteScroll/InfiniteScroll';
import ImageCarousel from './components/ImageCarousel/ImageCarousel';
import AutoScrollVerticalGalleryManual from './components/AutoScrollVerticalGalleryManual/AutoScrollVerticalGalleryManual';
import AutocompleteSearch from './components/AutocompleteSearch/AutocompleteSearch';
import React19Features from './components/React19Features/React19Features';
import React19FeaturesComprehensive from './components/React19Features/React19FeaturesComprehensive';

function App() {
  return (
    <div>
      <MenuBar /> {/* Always outside Routes */}
      <Routes>
        <Route path="/" element={<AllFeatures />} />
        <Route path="/drag-and-drop" element={<DragAndDrop />} />
        <Route path="/infinite-scroll" element={<InfiniteScroll />} />
        <Route path="/image-carousel" element={<ImageCarousel />} />
        <Route path="/image-gallery" element={<AutoScrollVerticalGalleryManual />} />
        <Route path="/autocomplete" element={<AutocompleteSearch />} />
        <Route path="/react-features" element={<React19Features />} />
        <Route path="/react19-features-comprehensive" element={<React19FeaturesComprehensive />} />
      </Routes>
    </div>
  );
}

export default App;
