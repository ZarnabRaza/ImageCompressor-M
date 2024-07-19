import React from "react";
import imageCompression from "browser-image-compression";
import { Card, Container, Row, Col, Form, Button } from "react-bootstrap";
import './index.css'

class ImageCompressor extends React.Component {
  constructor() {
    super();
    this.state = {
      compressedLink: "https://testersdock.com/wp-content/uploads/2017/09/file-upload-1280x640.png",
      originalImage: null,
      originalLink: "",
      clicked: false,
      uploadImage: false,
      originalDimensions: null,
      compressedDimensions: null,
      compressedSize: null,
      compressionPercentage: 100,
      customWidth: '',
      customHeight: ''
    };
  }

  handleImageUpload = e => {
    const imageFile = e.target.files[0];
    const reader = new FileReader();

    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        this.setState({
          originalLink: URL.createObjectURL(imageFile),
          originalImage: imageFile,
          uploadImage: true,
          originalDimensions: { width: img.width, height: img.height }
        });
      };
      img.src = event.target.result;
    };

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  };

  handleCompressionPercentageChange = e => {
    this.setState({ compressionPercentage: e.target.value });
  };

  handleCustomWidthChange = e => {
    this.setState({ customWidth: e.target.value });
  };

  handleCustomHeightChange = e => {
    this.setState({ customHeight: e.target.value });
  };

  compressImage = () => {
    const { originalImage, compressionPercentage, customWidth, customHeight } = this.state;
  
    if (!originalImage) {
      alert("Please upload an image first.");
      return;
    }
  
    const maxSizeMB = (originalImage.size / 1024 / 1024) * (compressionPercentage / 100);
    const options = {
      maxSizeMB: maxSizeMB,
      useWebWorker: true,
      initialQuality: compressionPercentage / 100,
      maxWidthOrHeight: customWidth && customHeight ? Math.max(customWidth, customHeight) : 800,
      maxWidth: customWidth || undefined,
      maxHeight: customHeight || undefined,
    };
  
    imageCompression(originalImage, options)
      .then(compressedImage => {
        const compressedLink = URL.createObjectURL(compressedImage);
        const compressedSize = (compressedImage.size / 1024).toFixed(2);
  
        this.setState({
          compressedLink: compressedLink,
          clicked: true,
          compressedSize: compressedSize
        });
  
        const img = new Image();
        img.onload = () => {
          this.setState({
            compressedDimensions: { width: img.width, height: img.height }
          });
        };
        img.src = compressedLink;
      })
      .catch(error => {
        console.error("Image compression error:", error);
        alert("Failed to compress image. Please try again.");
      });
  };

  render() {
    const { uploadImage, originalLink, originalDimensions, originalImage, compressedLink, clicked, compressedDimensions, compressedSize, compressionPercentage, customWidth, customHeight } = this.state;

    return (
      <div className="app-background">
        <Container>
          <div className="text-center mb-5">
            <h1 className="display-4 app-title">Elite Image Compressor</h1>
            <p className="lead">Compress your images effortlessly with our premium tool</p>
          </div>

          <Row>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm app-card">
                <Card.Img variant="top" src={uploadImage ? originalLink : "https://testersdock.com/wp-content/uploads/2017/09/file-upload-1280x640.png"} />
                <Card.Body>
                  <div className="d-flex justify-content-center">
                    <Form.Control type="file" accept="image/*" className="mt-2" onChange={this.handleImageUpload} />
                  </div>
                  {originalDimensions && (
                    <p className="text-center mt-2">Original Dimensions: {originalDimensions.width}x{originalDimensions.height}</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-4 d-flex flex-column justify-content-center align-items-center">
              <Form className="w-100">
                <Form.Group className="text-center">
                  <Form.Label className="form-label">Compression Percentage</Form.Label>
                  <Form.Control type="range" min="1" max="100" value={compressionPercentage} onChange={this.handleCompressionPercentageChange} className="app-slider" />
                  <Form.Text className="form-text">{compressionPercentage}%</Form.Text>
                </Form.Group>

                <Form.Group className="text-center mt-3">
                  <Form.Label className="form-label">Custom Dimensions</Form.Label>
                  <Form.Control type="number" placeholder="Width" value={customWidth} onChange={this.handleCustomWidthChange} className="mb-2 app-input" />
                  <Form.Control type="number" placeholder="Height" value={customHeight} onChange={this.handleCustomHeightChange} className="app-input" />
                </Form.Group>
              </Form>
              {originalImage && (
                <Button variant="primary" size="lg" onClick={this.compressImage} className="mt-3 app-button">Compress</Button>
              )}
            </Col>

            <Col md={4} className="mb-4">
              <Card className="shadow-sm app-card">
                <Card.Img variant="top" src={compressedLink} />
                {clicked && (
                  <Card.Body>
                    <div className="d-flex justify-content-center">
                      <Button href={compressedLink} download="compressed_image.jpg" variant="success" className="w-75 app-button">Download</Button>
                    </div>
                    {compressedDimensions && (
                      <p className="text-center mt-2">Compressed Dimensions: {compressedDimensions.width}x{compressedDimensions.height}</p>
                    )}
                    {compressedSize && (
                      <p className="text-center mt-2">Compressed Size: {compressedSize} KB</p>
                    )}
                  </Card.Body>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ImageCompressor;
