// WebSocket management
import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for WebSocket connections
 * Provides real-time communication capabilities for the Guardian Eagle system
 */
export const useWebSocket = (url, options = {}) => {
  const {
    onOpen,
    onClose,
    onError,
    onMessage,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    shouldReconnect = true
  } = options;

  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const socketRef = useRef(null);

  // Connection states
  const connectionStates = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
    UNINSTANTIATED: null
  };

  const connect = useCallback(() => {
    try {
      // Only connect if URL is provided and we don't have an active connection
      if (!url || (socketRef.current && socketRef.current.readyState === WebSocket.OPEN)) {
        return;
      }

      const ws = new WebSocket(url);
      socketRef.current = ws;
      setSocket(ws);

      ws.onopen = (event) => {
        setReadyState(WebSocket.OPEN);
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
        onOpen?.(event);
      };

      ws.onclose = (event) => {
        setReadyState(WebSocket.CLOSED);
        socketRef.current = null;
        onClose?.(event);

        // Attempt to reconnect if enabled and not a clean close
        if (shouldReconnect && 
            reconnectAttemptsRef.current < reconnectAttempts && 
            !event.wasClean) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (event) => {
        setReadyState(WebSocket.CLOSED);
        onError?.(event);
      };

      ws.onmessage = (event) => {
        setLastMessage(event);
        onMessage?.(event);
      };

      setReadyState(WebSocket.CONNECTING);
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setReadyState(WebSocket.CLOSED);
    }
  }, [url, onOpen, onClose, onError, onMessage, shouldReconnect, reconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (socketRef.current) {
      socketRef.current.close();
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        const messageToSend = typeof message === 'string' ? message : JSON.stringify(message);
        socketRef.current.send(messageToSend);
        return true;
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        return false;
      }
    }
    console.warn('WebSocket is not connected. Cannot send message.');
    return false;
  }, []);

  // Send JSON message with type
  const sendJsonMessage = useCallback((type, payload) => {
    const message = { type, payload, timestamp: new Date().toISOString() };
    return sendMessage(message);
  }, [sendMessage]);

  // Connect on mount and when URL changes
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    lastMessage,
    readyState,
    sendMessage,
    sendJsonMessage,
    connect,
    disconnect,
    connectionStates
  };
};

export default useWebSocket;
