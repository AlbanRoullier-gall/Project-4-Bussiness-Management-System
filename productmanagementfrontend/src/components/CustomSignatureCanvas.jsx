import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useDispatch } from 'react-redux';
import { updateSignature, clearSignature } from '../redux/signatureSlice';
import './CustomSignatureCanvas.css'; 

const CustomSignatureCanvas = () => {
  const dispatch = useDispatch();
  const signatureRef = useRef(null);

  return (
    <div className='agencement-proposition'>
      <strong>SIGNATURE</strong>
      <div className='custom-signature-container'> 
        <SignatureCanvas
          ref={signatureRef}
          penColor='black'
          canvasProps={{ width: 200, height: 80, className: 'signature-canvas' }}
          onEnd={() => {
            const signature = signatureRef.current.toDataURL();
            dispatch(updateSignature(signature));
          }}
        />
        <button onClick={() => {
          if (signatureRef.current) {
            signatureRef.current.clear();
            dispatch(clearSignature());
          }
        }}>Effacer la signature</button>
      </div>
    </div>
  );
};

export default CustomSignatureCanvas;
