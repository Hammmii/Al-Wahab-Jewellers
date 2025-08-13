
"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Draggable from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Scale, Sparkles, Hand, RotateCcw, ZoomIn, ZoomOut, CheckCircle, Camera, VideoOff, GemIcon } from 'lucide-react';
import { products } from '@/lib/placeholder-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Script from 'next/script';

export default function VirtualTryOnPage() {
  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(products.find(p => p.category === 'Rings'));
  const [itemState, setItemState] = useState({ scale: 1, rotation: 0, position: { x: 0, y: 0 } });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'Rings' | 'Necklaces'>('Rings');
  const [detectedFeature, setDetectedFeature] = useState<'hand' | 'neck' | null>(null);
  const [detectionMessage, setDetectionMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [handPosition, setHandPosition] = useState<{x: number, y: number} | null>(null);
  const [neckPosition, setNeckPosition] = useState<{x: number, y: number} | null>(null);
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [showItemOnBody, setShowItemOnBody] = useState(false);
  const { toast } = useToast();

  // Load TensorFlow.js and models
  useEffect(() => {
    // This effect handles loading the TensorFlow.js models
    if (typeof window !== 'undefined') {
      // We'll simulate model loading with a timeout
      const loadModels = async () => {
        setIsProcessing(true);
        setDetectionMessage('Loading detection models...');
        
        // Simulate model loading time
        setTimeout(() => {
          setModelLoaded(true);
          setIsProcessing(false);
          setDetectionMessage('Models loaded successfully! Ready for detection.');
          console.log('Detection models loaded');
        }, 2000);
      };
      
      if (!modelLoaded) {
        loadModels();
      }
    }
    
    // Cleanup function
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, []);

  // Handle camera access and detection
  useEffect(() => {
    if (!useCamera) {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      
      // Clear detection interval when camera is off
      if (detectionInterval) {
        clearInterval(detectionInterval);
        setDetectionInterval(null);
      }
      return;
    }

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          } 
        });
        
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            // Start detection once video is ready
            if (modelLoaded) {
              if (activeCategory === 'Rings') {
                startHandDetection();
              } else if (activeCategory === 'Necklaces') {
                startNeckDetection();
              }
            }
          };
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        setUseCamera(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };
    
    if (modelLoaded) {
      getCameraPermission();
    }
  }, [useCamera, activeCategory, modelLoaded, toast, detectionInterval]);
  
  // Effect to reset detection when category changes
  useEffect(() => {
    setDetectedFeature(null);
    setDetectionMessage('');
    setShowItemOnBody(false);
    setHandPosition(null);
    setNeckPosition(null);
    
    // Clear previous detection interval
    if (detectionInterval) {
      clearInterval(detectionInterval);
      setDetectionInterval(null);
    }
    
    if (useCamera && modelLoaded) {
      if (activeCategory === 'Rings') {
        startHandDetection();
      } else if (activeCategory === 'Necklaces') {
        startNeckDetection();
      }
    }
    
    // Reset selected item based on category
    setSelectedItem(products.find(p => p.category === activeCategory));
    // Reset item state
    setItemState({ scale: 1, rotation: 0, position: { x: 0, y: 0 } });
  }, [activeCategory, modelLoaded, useCamera, detectionInterval]);


  // Feature detection functions
  const startHandDetection = () => {
    if (!videoRef.current || !useCamera || !modelLoaded) return;
    
    setIsProcessing(true);
    setDetectionMessage('Looking for hand...');
    setDetectedFeature(null);
    setShowItemOnBody(false);
    
    // Clear any existing detection interval
    if (detectionInterval) {
      clearInterval(detectionInterval);
    }
    
    // Create a new detection interval for real-time hand tracking
    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas for analysis
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Real-time hand detection simulation
      // In a real implementation, this would use TensorFlow.js hand pose detection
      if (!detectedFeature) {
        // First detection - simulate finding a hand
        const randomDetectionSuccess = Math.random() > 0.3; // 70% chance of success
        
        if (randomDetectionSuccess) {
          // Calculate a position in the middle-bottom area of the video
          const x = canvas.width / 2 + (Math.random() * 100 - 50);
          const y = canvas.height * 0.7 + (Math.random() * 50);
          
          setHandPosition({ x, y });
          setDetectedFeature('hand');
          setDetectionMessage('Hand detected! You can now try on rings.');
          setIsProcessing(false);
          setShowItemOnBody(true);
          
          // Update item position to match hand
          setItemState(prev => ({
            ...prev,
            position: { x: x - canvas.width/2, y: y - canvas.height/2 }
          }));
        }
      } else {
        // Continuous real-time tracking - simulate hand movement
        if (handPosition) {
          // Add small random movements to simulate tracking
          const newX = handPosition.x + (Math.random() * 10 - 5);
          const newY = handPosition.y + (Math.random() * 10 - 5);
          
          setHandPosition({ x: newX, y: newY });
          
          // Update item position to follow hand in real-time
          setItemState(prev => ({
            ...prev,
            position: { x: newX - canvas.width/2, y: newY - canvas.height/2 }
          }));
        }
      }
    }, 50); // Run detection every 50ms for smoother real-time tracking
    
    setDetectionInterval(interval);
    
    return () => clearInterval(interval);
  };
  
  const startNeckDetection = () => {
    if (!videoRef.current || !useCamera || !modelLoaded) return;
    
    setIsProcessing(true);
    setDetectionMessage('Looking for neck...');
    setDetectedFeature(null);
    setShowItemOnBody(false);
    
    // Clear any existing detection interval
    if (detectionInterval) {
      clearInterval(detectionInterval);
    }
    
    // Create a new detection interval for real-time neck tracking
    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas for analysis
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Real-time neck detection simulation
      // In a real implementation, this would use TensorFlow.js pose detection
      if (!detectedFeature) {
        // First detection - simulate finding a neck
        const randomDetectionSuccess = Math.random() > 0.3; // 70% chance of success
        
        if (randomDetectionSuccess) {
          // Calculate a position in the upper-middle area of the video
          const x = canvas.width / 2 + (Math.random() * 60 - 30);
          const y = canvas.height * 0.3 + (Math.random() * 40);
          
          setNeckPosition({ x, y });
          setDetectedFeature('neck');
          setDetectionMessage('Neck detected! You can now try on necklaces.');
          setIsProcessing(false);
          setShowItemOnBody(true);
          
          // Update item position to match neck
          setItemState(prev => ({
            ...prev,
            position: { x: x - canvas.width/2, y: y - canvas.height/2 }
          }));
        }
      } else {
        // Continuous real-time tracking - simulate neck movement
        if (neckPosition) {
          // Add small random movements to simulate tracking
          const newX = neckPosition.x + (Math.random() * 6 - 3);
          const newY = neckPosition.y + (Math.random() * 6 - 3);
          
          setNeckPosition({ x: newX, y: newY });
          
          // Update item position to follow neck in real-time
          setItemState(prev => ({
            ...prev,
            position: { x: newX - canvas.width/2, y: newY - canvas.height/2 }
          }));
        }
      }
    }, 50); // Run detection every 50ms for smoother real-time tracking
    
    setDetectionInterval(interval);
    
    return () => clearInterval(interval);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setBodyImage(imageUrl);
        setIsSubmitted(false);
        setUseCamera(false);
        setShowItemOnBody(false);
        
        // Clear any existing detection interval
        if (detectionInterval) {
          clearInterval(detectionInterval);
          setDetectionInterval(null);
        }
        
        // Simulate feature detection on uploaded image
        setIsProcessing(true);
        setDetectionMessage(`Analyzing image for ${activeCategory === 'Rings' ? 'hand' : 'neck'}...`);
        
        // Create a temporary image to get dimensions
        const img = new Image(0, 0);
        img.onload = () => {
          // Process the image for detection
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            if (context) {
              // Set canvas dimensions to match image
              canvas.width = img.width;
              canvas.height = img.height;
              
              // Draw the image to the canvas for analysis
              context.drawImage(img, 0, 0, canvas.width, canvas.height);
              
              // Simulate detection with a timeout
              setTimeout(() => {
                if (activeCategory === 'Rings') {
                  // Simulate hand detection in the lower part of the image
                  const x = canvas.width / 2 + (Math.random() * 100 - 50);
                  const y = canvas.height * 0.7 + (Math.random() * 50);
                  
                  setHandPosition({ x, y });
                  setDetectedFeature('hand');
                  setDetectionMessage('Hand detected in your photo!');
                  setShowItemOnBody(true);
                  
                  // Position the ring on the detected hand
                  setItemState(prev => ({
                    ...prev,
                    position: { x: x - canvas.width/2, y: y - canvas.height/2 }
                  }));
                } else {
                  // Simulate neck detection in the upper part of the image
                  const x = canvas.width / 2 + (Math.random() * 60 - 30);
                  const y = canvas.height * 0.3 + (Math.random() * 40);
                  
                  setNeckPosition({ x, y });
                  setDetectedFeature('neck');
                  setDetectionMessage('Neck detected in your photo!');
                  setShowItemOnBody(true);
                  
                  // Position the necklace on the detected neck
                  setItemState(prev => ({
                    ...prev,
                    position: { x: x - canvas.width/2, y: y - canvas.height/2 }
                  }));
                }
                setIsProcessing(false);
              }, 1500);
            }
          }
        };
        img.src = imageUrl;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSelectItem = (slug: string) => {
    const item = products.find(p => p.slug === slug);
    setSelectedItem(item);
  }

  const ringItems = products.filter(p => p.category === activeCategory);

  const handleSubmitForQuote = async () => {
    try {
      setIsSubmitted(true);
      setIsLoading(true);
      
      // Simulate API request with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Since we don't have a real API endpoint yet, we'll simulate a successful response
      const mockRequestId = `VTO-${Math.floor(Math.random() * 10000)}`;
      
      setIsLoading(false);
      
      toast({
        title: "Quote Requested!",
        description: `Our team will contact you shortly with more details for your ${activeCategory === 'Rings' ? 'ring' : 'necklace'}. Reference: ${mockRequestId}`,
      });
    } catch (error) {
      console.error('Error submitting quote:', error);
      setIsSubmitted(false);
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "There was a problem submitting your quote request. Please try again.",
      });
    }
  }
  
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // If we have a selected item, draw it on the canvas at the current position
        if (selectedItem && showItemOnBody) {
          // Create a temporary image for the selected item
          const itemImg = new Image(0, 0);
          itemImg.onload = () => {
            // Calculate position based on detected feature position
            let x = canvas.width / 2;
            let y = canvas.height / 2;
            
            if (activeCategory === 'Rings' && handPosition) {
              x = handPosition.x;
              y = handPosition.y;
            } else if (activeCategory === 'Necklaces' && neckPosition) {
              x = neckPosition.x;
              y = neckPosition.y;
            }
            
            // Apply transformations (scale and rotation)
            context.save();
            context.translate(x, y);
            context.rotate(itemState.rotation * Math.PI / 180);
            context.scale(itemState.scale, itemState.scale);
            
            // Draw the item centered at the position
            const itemWidth = activeCategory === 'Rings' ? 100 : 200;
            const itemHeight = activeCategory === 'Rings' ? 100 : 200;
            context.drawImage(itemImg, -itemWidth/2, -itemHeight/2, itemWidth, itemHeight);
            
            context.restore();
            
            // Convert canvas to data URL and set as body image
            const imageUrl = canvas.toDataURL('image/png');
            setBodyImage(imageUrl);
            setUseCamera(false);
            
            // Clear any detection intervals
            if (detectionInterval) {
              clearInterval(detectionInterval);
              setDetectionInterval(null);
            }
          };
          itemImg.src = selectedItem.images[0];
        } else {
          // If no item selected, just capture the video frame
          const imageUrl = canvas.toDataURL('image/png');
          setBodyImage(imageUrl);
          setUseCamera(false);
          
          // Clear any detection intervals
          if (detectionInterval) {
            clearInterval(detectionInterval);
            setDetectionInterval(null);
          }
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 bg-hero-pattern">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Virtual Try-On</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          See how our jewelry looks on you. Upload a photo or use your camera to find your perfect piece.
        </p>
      </div>
      
      <Tabs defaultValue="rings" className="mb-8" onValueChange={(value) => setActiveCategory(value as 'Rings' | 'Necklaces')}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="Rings" className="text-lg py-3">
            <Hand className="mr-2 h-4 w-4" /> Rings
          </TabsTrigger>
          <TabsTrigger value="Necklaces" className="text-lg py-3">
            <GemIcon className="mr-2 h-4 w-4" /> Necklaces
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2">
          <Card className="border-border/40 w-full h-[600px] flex items-center justify-center relative overflow-hidden bg-card/50">
            
            {!bodyImage && !useCamera && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-6 p-4 rounded-full bg-primary/10">
                  {activeCategory === 'Rings' ? (
                    <Hand className="h-12 w-12 text-primary" />
                  ) : (
                    <GemIcon className="h-12 w-12 text-primary" />
                  )}
                </div>
                <h3 className="text-xl font-headline font-semibold mb-4">
                  Upload a Photo of Your {activeCategory === 'Rings' ? 'Hand' : 'Neck'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  Upload a clear photo of your {activeCategory === 'Rings' ? 'hand' : 'neck'} to see how our {activeCategory.toLowerCase()} would look on you.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Upload Image
                  </Button>
                  <Button variant="outline" onClick={() => setUseCamera(true)} className="flex items-center gap-2">
                    <Camera className="h-4 w-4" /> Use Camera
                  </Button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
            
            {useCamera && (
              <div className="w-full h-full flex flex-col items-center justify-center">
                {hasCameraPermission ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Detection overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {isProcessing && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="bg-background p-4 rounded-lg shadow-lg text-center">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                            <p>{detectionMessage}</p>
                          </div>
                        </div>
                      )}
                      
                      {detectedFeature && (
                        <div className="absolute top-4 left-4 right-4 bg-green-500/90 text-white p-2 rounded-md text-center">
                          {detectionMessage}
                        </div>
                      )}
                    </div>
                    
                    {selectedItem && showItemOnBody && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          top: `calc(50% + ${itemState.position?.y || 0}px)`,
                          left: `calc(50% + ${itemState.position?.x || 0}px)`,
                          transform: `scale(${itemState.scale}) rotate(${itemState.rotation}deg)`,
                          transformOrigin: 'center',
                          transition: 'transform 0.2s ease-out, top 0.1s ease-out, left 0.1s ease-out',
                          zIndex: 10
                        }}
                      >
                        <img
                          src={selectedItem.images[0]}
                          alt={selectedItem.name}
                          className={`object-contain ${activeCategory === 'Rings' ? 'w-24 h-24' : 'w-48 h-48'}`}
                        />
                      </div>
                    )}
                    
                    {detectedFeature === 'hand' && handPosition && (
                      <div 
                        className="absolute w-4 h-4 rounded-full bg-green-500 opacity-50"
                        style={{
                          top: `${handPosition.y}px`,
                          left: `${handPosition.x}px`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 5
                        }}
                      />
                    )}
                    {detectedFeature === 'neck' && neckPosition && (
                      <div 
                        className="absolute w-4 h-4 rounded-full bg-green-500 opacity-50"
                        style={{
                          top: `${neckPosition.y}px`,
                          left: `${neckPosition.x}px`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 5
                        }}
                      />
                    )}
                    
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                      <Button
                        onClick={takePhoto}
                        className="flex items-center gap-2"
                        disabled={isProcessing || !detectedFeature}
                      >
                        <Camera className="h-4 w-4" /> Take Photo
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setUseCamera(false);
                          setDetectedFeature(null);
                          if (detectionInterval) {
                            clearInterval(detectionInterval);
                            setDetectionInterval(null);
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <VideoOff className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-xl font-headline font-semibold mb-2">Camera Access Denied</h3>
                    <p className="text-muted-foreground mb-4">Please enable camera access in your browser settings to use this feature.</p>
                    <Button variant="outline" onClick={() => setUseCamera(false)}>
                      Go Back
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {bodyImage && (
              <div className="relative w-full h-full">
                <img
                  src={bodyImage}
                  alt={`Your ${activeCategory === 'Rings' ? 'hand' : 'neck'}`}
                  className="w-full h-full object-contain"
                />
                
                {selectedItem && showItemOnBody && (
                  <Draggable bounds="parent">
                    <div className="absolute cursor-move" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      <div className="relative">
                        <img
                          src={selectedItem.images[0]}
                          alt={selectedItem.name}
                          className={`object-contain ${activeCategory === 'Rings' ? 'w-24 h-24' : 'w-48 h-48'}`}
                          style={{
                            transform: `scale(${itemState.scale}) rotate(${itemState.rotation}deg)`,
                            transformOrigin: 'center',
                          }}
                        />
                      </div>
                    </div>
                  </Draggable>
                )}
                
                {detectedFeature === 'hand' && handPosition && (
                  <div 
                    className="absolute w-4 h-4 rounded-full bg-green-500 opacity-50"
                    style={{
                      top: `${handPosition.y}px`,
                      left: `${handPosition.x}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
                {detectedFeature === 'neck' && neckPosition && (
                  <div 
                    className="absolute w-4 h-4 rounded-full bg-green-500 opacity-50"
                    style={{
                      top: `${neckPosition.y}px`,
                      left: `${neckPosition.x}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setItemState({ ...itemState, scale: Math.max(0.5, itemState.scale - 0.1) })}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setItemState({ ...itemState, scale: Math.min(2, itemState.scale + 0.1) })}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setItemState({ ...itemState, rotation: itemState.rotation - 15 })}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBodyImage(null);
                      setItemState({ scale: 1, rotation: 0 });
                      setDetectedFeature(null);
                      setDetectionMessage(null);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
            

              </Card>
            </div>
            
            <div>
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary">Select {activeCategory === 'Rings' ? 'a Ring' : 'a Necklace'}</CardTitle>
                  <CardDescription>Choose {activeCategory === 'Rings' ? 'a ring' : 'a necklace'} to try on virtually</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-select">{activeCategory === 'Rings' ? 'Ring' : 'Necklace'} Style</Label>
                    <Select value={selectedItem?.slug} onValueChange={handleSelectItem}>
                      <SelectTrigger id="item-select">
                        <SelectValue placeholder={`Select ${activeCategory === 'Rings' ? 'a ring' : 'a necklace'}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {ringItems.map(item => (
                          <SelectItem key={item.id} value={item.slug}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedItem && (
                    <div className="pt-4 space-y-4">
                      <div className="aspect-square relative rounded-md overflow-hidden border border-border/40">
                        <Image 
                          src={selectedItem.images[0]} 
                          alt={selectedItem.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-headline text-lg font-medium">{selectedItem.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedItem.metalType}</p>
                        <p className="text-primary font-semibold">PKR {selectedItem.price.toLocaleString()}</p>
                      </div>
                      
                      {bodyImage && (
                        <Button 
                          className="w-full" 
                          onClick={handleSubmitForQuote}
                          disabled={isSubmitted || isLoading}
                        >
                          {isSubmitted ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Quote Requested
                            </>
                          ) : isLoading ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            'Request Quote'
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-8">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Sparkles className="h-6 w-6" /> Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                  <Label className="mb-2 block">1. Choose Your View</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                        <Upload className="mr-2" /> Upload Photo
                    </Button>
                    <Button onClick={() => { setUseCamera(true); setBodyImage(null); }} className="w-full" variant="outline">
                        <Camera className="mr-2" /> Use Camera
                    </Button>
                  </div>
                  <Input 
                    ref={fileInputRef} 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                </div>
                <div>
                  <Label htmlFor="item-select" className="mb-2 block">2. Select {activeCategory === 'Rings' ? 'a Ring' : 'a Necklace'}</Label>
                  <Select onValueChange={handleSelectItem} value={selectedItem?.slug}>
                    <SelectTrigger id="item-select">
                        <SelectValue placeholder={`Choose ${activeCategory === 'Rings' ? 'a ring' : 'a necklace'} to try on`} />
                    </SelectTrigger>
                    <SelectContent>
                        {ringItems.map(item => (
                            <SelectItem key={item.id} value={item.slug}>{item.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              <div className="space-y-4">
                 <Label>3. Adjust the {activeCategory === 'Rings' ? 'Ring' : 'Necklace'}</Label>
                 <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => setItemState(s => ({...s, scale: s.scale * 1.1}))} disabled={!bodyImage && !useCamera}>
                        <ZoomIn className="mr-2"/> Zoom In
                    </Button>
                     <Button variant="outline" onClick={() => setItemState(s => ({...s, scale: s.scale * 0.9}))} disabled={!bodyImage && !useCamera}>
                        <ZoomOut className="mr-2"/> Zoom Out
                    </Button>
                     <Button variant="outline" onClick={() => setItemState(s => ({...s, rotation: s.rotation - 15}))} disabled={!bodyImage && !useCamera}>
                        <RotateCcw className="mr-2"/> Rotate
                    </Button>
                     <Button variant="outline" onClick={() => setItemState({ scale: 1, rotation: 0, position: { x: 0, y: 0 }})} disabled={!bodyImage && !useCamera}>
                        Reset
                    </Button>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
             <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Happy With Your Choice?</CardTitle>
             </CardHeader>
             <CardContent>
                {isSubmitted ? (
                    <div className="text-center py-4 flex flex-col items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                        <h2 className="font-headline text-xl text-primary mb-2">Quote Requested!</h2>
                        <p className="text-muted-foreground text-sm">Our team will contact you shortly with details.</p>
                    </div>
                ) : (
                    <>
                    <p className="text-muted-foreground mb-4">Click below to submit your design for a personalized quote from our expert artisans.</p>
                    <Button 
                        onClick={handleSubmitForQuote} 
                        className="w-full" 
                        size="lg" 
                        disabled={(!bodyImage && !useCamera) || !selectedItem || isLoading || !detectedFeature}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            'Submit for a Quote'
                        )}
                    </Button>
                    </>
                )}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
