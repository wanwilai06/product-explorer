"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
    const [products, setProducts] = useState<Product[]>([]);
    const [status, setStatus] = useState<LoadState>("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const [editing, setEditing] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts(defaultQuery).then(showResult).catch(showError);
    }, []);

    function showResult(list: ProductList) {
        setProducts(list.products);
        setStatus("ready");
        console.log(`พบสินค้า ${list.total} รายการ`, list.products);
    }

    function showError(error: unknown) {
        setErrorMessage(
            error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
        );
        setStatus("error");
    }

    async function loadProducts(query: SearchQuery) {
        setStatus("loading");
        setErrorMessage("");

        try {
            showResult(await fetchProducts(query));
        } catch (error) {
            showError(error);
        }
    }

    function saveProduct(draft: ProductDraft) {
        if (editing) {
            // กรณีแก้ไข: อัปเดตตัวเดิมใน Array
            setProducts(products.map(p => p.id === editing.id ? { ...editing, ...draft } : p));
            setEditing(null); // กลับสู่โหมดเพิ่มใหม่
        } else {
            // กรณีเพิ่มใหม่
            setProducts([...products, { ...draft, id: Date.now(), thumbnail: "https://via.placeholder.com/150", rating: draft.rating || 5.0 }]);
        }
    }

    function removeProduct(id: number) {
        setProducts(products.filter(p => p.id !== id));
        if (editing?.id === id) {
            setEditing(null); // ถ้ากำลังแก้ตัวที่ถูกลบอยู่ ให้รีเซ็ตฟอร์ม
        }
    }

    return (
        <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif', color: '#333' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>รายการสินค้า</h1>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    type="button"
                    onClick={() => loadProducts(defaultQuery)}
                    disabled={status === "loading"}
                    style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
                >
                    {status === "loading" ? "กำลังโหลด" : "โหลดข้อมูล"}
                </button>
            </div>

            <ProductSearchForm onSearch={loadProducts} />

            <section aria-live="polite" style={{ marginTop: '20px' }}>
                {status === "loading" && <p style={{ color: '#666' }}>กำลังโหลดข้อมูล...</p>}
                {status === "error" && <p role="alert" style={{ color: 'red' }}>{errorMessage}</p>}
                {status === "ready" && products.length === 0 && (
                    <p style={{ color: '#666' }}>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
                )}

                {/* แสดงผลแบบ Card Grid 4 คอลัมน์ */}
                {status === "ready" && products.length > 0 && (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', 
                        gap: '20px', 
                        marginTop: '15px' 
                    }}>
                        {products.map((item) => (
                            <div 
                                key={item.id} 
                                style={{ 
                                    background: '#fff', 
                                    border: '1px solid #eaeaea', 
                                    borderRadius: '8px', 
                                    padding: '16px', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '10px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}
                            >
                                {/* รูปภาพสินค้า */}
                                <div style={{ width: '100%', height: '140px', background: '#f9f9f9', borderRadius: '6px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img
                                        src={item.thumbnail || "https://via.placeholder.com/150"}
                                        alt={item.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>

                                {/* หมวดหมู่ */}
                                <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {item.category}
                                </span>

                                {/* ชื่อสินค้า */}
                                <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0', color: '#333', minHeight: '38px', lineHeight: '1.3' }}>
                                    {item.title}
                                </h3>

                                {/* ราคาและจำนวนคงเหลือ */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#1890ff' }}>฿{item.price}</span>
                                    <span style={{ color: '#666', fontSize: '12px' }}>คงเหลือ: {item.stock}</span>
                                </div>

                                {/* แสดงคะแนนรีวิวสินค้า */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#faad14', borderTop: '1px solid #f2f2f2', paddingTop: '8px' }}>
                                    <span>⭐ {item.rating ? Number(item.rating).toFixed(1) : '4.5'}</span>
                                    <span style={{ color: '#999', fontSize: '12px' }}>(รีวิว)</span>
                                </div>

                                {/* ปุ่มจัดการ (แก้ไข / ลบ) */}
                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setEditing(item)}
                                        style={{ flex: 1, padding: '6px 8px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
                                    >
                                        แก้ไข
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeProduct(item.id)}
                                        style={{ flex: 1, padding: '6px 8px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ff4d4f', background: '#fff', color: '#ff4d4f' }}
                                    >
                                        ลบ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <div style={{ marginTop: '40px' }}>
                <ProductForm
                    editing={editing}
                    onSave={saveProduct}
                    onCancel={() => setEditing(null)}
                />
            </div>
        </main>
    );
}