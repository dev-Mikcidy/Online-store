import {
  createContext,
  useState,
  useEffect,
} from "react";

export const CartContext =
  createContext();

export function CartProvider({
  children,
}) {
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3001";

  const [cart, setCart] = useState({
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
  });

  // GET TOKEN
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // GUEST CART HELPERS
  const getGuestCart = () => {
    const storedCart =
      localStorage.getItem("guestCart");

    return storedCart
      ? JSON.parse(storedCart)
      : {
          items: [],
          totalQuantity: 0,
          totalPrice: 0,
        };
  };

  const saveGuestCart = (
    updatedCart
  ) => {
    localStorage.setItem(
      "guestCart",
      JSON.stringify(updatedCart)
    );

    setCart(updatedCart);
  };

  // FETCH CART
  const fetchCart = async () => {
    const token = getToken();

    // GUEST USER
    if (!token) {
      const guestCart =
        getGuestCart();

      setCart(guestCart);

      return;
    }

    // LOGGED-IN USER
    try {
      const response = await fetch(
        `${API_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch cart"
        );
      }

      setCart(data);

    } catch (error) {
      console.error(error);
    }
  };

  // LOAD CART ON APP START
  useEffect(() => {
    fetchCart();
  }, []);

  // ADD TO CART
  const addToCart = async (
    productId,
    quantity = 1
  ) => {
    const token = getToken();

    // GUEST USER
    if (!token) {
      try {
        const response = await fetch(
          `${API_URL}/api/products/${productId}`
        );

        const product =
          await response.json();

        const guestCart =
          getGuestCart();

        const existingItem =
          guestCart.items.find(
            (item) =>
              item.product._id ===
              productId
          );

        let updatedItems;

        if (existingItem) {
          updatedItems =
            guestCart.items.map(
              (item) =>
                item.product._id ===
                productId
                  ? {
                      ...item,
                      quantity:
                        item.quantity + 1,
                    }
                  : item
            );
        } else {
          updatedItems = [
            ...guestCart.items,
            {
              product,
              quantity: 1,
            },
          ];
        }

        const updatedCart = {
          items: updatedItems,

          totalQuantity:
            updatedItems.reduce(
              (total, item) =>
                total + item.quantity,
              0
            ),

          totalPrice:
            updatedItems.reduce(
              (total, item) =>
                total +
                item.product.price *
                  item.quantity,
              0
            ),
        };

        saveGuestCart(updatedCart);

        return;

      } catch (error) {
        console.error(error);
      }
    }

    // LOGGED-IN USER
    try {
      const response = await fetch(
        `${API_URL}/api/cart`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            productId,
            quantity,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add to cart"
        );
      }

      setCart(data);

    } catch (error) {
      console.error(error);
    }
  };

  // INCREASE QUANTITY
  const increaseQuantity =
    async (productId) => {
      const token = getToken();

      // GUEST USER
      if (!token) {
        const guestCart =
          getGuestCart();

        const updatedItems =
          guestCart.items.map(
            (item) =>
              item.product._id ===
              productId
                ? {
                    ...item,
                    quantity:
                      item.quantity + 1,
                  }
                : item
          );

        const updatedCart = {
          items: updatedItems,

          totalQuantity:
            updatedItems.reduce(
              (total, item) =>
                total + item.quantity,
              0
            ),

          totalPrice:
            updatedItems.reduce(
              (total, item) =>
                total +
                item.product.price *
                  item.quantity,
              0
            ),
        };

        saveGuestCart(updatedCart);

        return;
      }

      // LOGGED-IN USER
      try {
        const currentItem =
          cart.items.find(
            (item) =>
              item.product._id ===
              productId
          );

        if (!currentItem) return;

        const response =
          await fetch(
            `${API_URL}/api/cart/${productId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                quantity:
                  currentItem.quantity + 1,
              }),
            }
          );

        const data =
          await response.json();

        setCart(data);

      } catch (error) {
        console.error(error);
      }
    };

  // DECREASE QUANTITY
  const decreaseQuantity =
    async (productId) => {
      const token = getToken();

      // GUEST USER
      if (!token) {
        const guestCart =
          getGuestCart();

        const updatedItems =
          guestCart.items
            .map((item) =>
              item.product._id ===
              productId
                ? {
                    ...item,
                    quantity:
                      item.quantity - 1,
                  }
                : item
            )
            .filter(
              (item) => item.quantity > 0
            );

        const updatedCart = {
          items: updatedItems,

          totalQuantity:
            updatedItems.reduce(
              (total, item) =>
                total + item.quantity,
              0
            ),

          totalPrice:
            updatedItems.reduce(
              (total, item) =>
                total +
                item.product.price *
                  item.quantity,
              0
            ),
        };

        saveGuestCart(updatedCart);

        return;
      }

      // LOGGED-IN USER
      try {
        const currentItem =
          cart.items.find(
            (item) =>
              item.product._id ===
              productId
          );

        if (!currentItem) return;

        if (
          currentItem.quantity === 1
        ) {
          removeFromCart(productId);

          return;
        }

        const response =
          await fetch(
            `${API_URL}/api/cart/${productId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                quantity:
                  currentItem.quantity - 1,
              }),
            }
          );

        const data =
          await response.json();

        setCart(data);

      } catch (error) {
        console.error(error);
      }
    };

  // REMOVE PRODUCT
  const removeFromCart =
    async (productId) => {
      const token = getToken();

      // GUEST USER
      if (!token) {
        const guestCart =
          getGuestCart();

        const updatedItems =
          guestCart.items.filter(
            (item) =>
              item.product._id !==
              productId
          );

        const updatedCart = {
          items: updatedItems,

          totalQuantity:
            updatedItems.reduce(
              (total, item) =>
                total + item.quantity,
              0
            ),

          totalPrice:
            updatedItems.reduce(
              (total, item) =>
                total +
                item.product.price *
                  item.quantity,
              0
            ),
        };

        saveGuestCart(updatedCart);

        return;
      }

      // LOGGED-IN USER
      try {
        const response =
          await fetch(
            `${API_URL}/api/cart/${productId}`,
            {
              method: "DELETE",

              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        setCart(data);

      } catch (error) {
        console.error(error);
      }
    };

  // CLEAR CART
  const clearCart = async () => {
    const token = getToken();

    // GUEST USER
    if (!token) {
      localStorage.removeItem(
        "guestCart"
      );

      setCart({
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      });

      return;
    }

    // LOGGED-IN USER
    try {
      const response = await fetch(
        `${API_URL}/api/cart`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      setCart(data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        fetchCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}