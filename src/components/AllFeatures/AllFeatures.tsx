import './AllFeatures.css'
import { useNavigate } from 'react-router-dom'
import features from './../data.json'


const AllFeatures = () => {
    const navigate = useNavigate()



  return (
    <div className="features-page">
      <h1 className="features-title">All Features</h1>

      <div className="features-grid" >
        {features.map((feature) => (
          <div onClick={() => navigate(`/${feature?.value}`)} key={feature?.name} className="feature-card">
            {feature.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllFeatures
