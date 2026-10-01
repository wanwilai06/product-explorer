"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
    editing: Product | null; // ถ้าเป็น null = เพิ่มสินค้าใหม่, ถ้าไม่ null = แก้ไขสินค้า
    onSave: (draft: ProductDraft) => void; // เรียกเมื่อบันทึกข้อมูลสินค้า
    onCancel: () => void; // เรียกเมื่อยกเลิกการแก้ไข
};

export default function ProductForm(
    { editing, onSave, onCancel }: ProductFormProps
) {
    const {
        register, // เชื่อม input กับ react-hook-form (อ่านค่าและตรวจสอบ)
        handleSubmit, // ครอบตอนกด Submit จะทำงานเมื่อข้อมูลผ่านเกณฑ์ Validation เท่านั้น
        reset,
        formState: { errors, isDirty, isValid }, // ตรวจสอบว่ามีการแก้ไขข้อมูลรึยัง และข้อมูลผ่านเกณฑ์มั้ย
    } = useForm<ProductDraft>({
        resolver: zodResolver(ProductDraftSchema),
        mode: "onTouched",
        defaultValues: editing
            ? {
                title: editing.title, 
                price: editing.price,
                stock: editing.stock, 
                category: editing.category,
                rating: editing.rating ?? 0,
            }
            : { title: "", price: undefined, stock: undefined, category: "" as any, rating: 0 },
    });

    useEffect(() => {
        if (editing) {
            reset({
                title: editing.title,
                price: editing.price,
                stock: editing.stock,
                category: editing.category,
                rating: editing.rating ?? 0,
            }); // ถ้าแก้ไขสินค้า ให้สินค้าเติมใส่ฟอร์มโดยอัตโนมัติ
        } else {
            reset({ title: "", price: undefined, stock: undefined, category: "" as any, rating: 0 });
        }
    }, [editing, reset]); 

    const inputStyle = {
        width: '100%', 
        padding: '8px 12px', 
        borderRadius: '4px', 
        border: '1px solid #ccc', 
        boxSizing: 'border-box' as const, 
        background: '#fff',
        height: '38px',
        fontSize: '14px',
        color: '#333'
    };

    return (
        <div style={{ width: '100%' }}>
            <form
                onSubmit={handleSubmit((values) => { onSave(values); reset(); })}
                noValidate
                style={{
                    background: '#fafafa',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #eaeaea',
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}
            >
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                    {editing ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่"} 
                </h3> 

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                    {/* ชื่อสินค้า */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label htmlFor="title" style={{ fontWeight: '500', fontSize: '14px', color: '#333' }}>ชื่อสินค้า</label>
                        <input
                            id="title"
                            placeholder="ระบุชื่อสินค้า..."
                            {...register("title")}
                            style={inputStyle}
                        />
                        {errors.title && <span style={{ color: 'red', fontSize: '12px' }}>{errors.title.message}</span>}
                    </div>

                    {/* ราคา */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label htmlFor="price" style={{ fontWeight: '500', fontSize: '14px', color: '#333' }}>ราคา</label>
                        <input
                            id="price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register("price", { valueAsNumber: true })}
                            style={inputStyle}
                        />
                        {errors.price && <span style={{ color: 'red', fontSize: '12px' }}>{errors.price.message}</span>}
                    </div>

                    {/* จำนวนคงเหลือ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label htmlFor="stock" style={{ fontWeight: '500', fontSize: '14px', color: '#333' }}>จำนวนคงเหลือ</label>
                        <input
                            id="stock"
                            type="number"
                            placeholder="0"
                            {...register("stock", { valueAsNumber: true })}
                            style={inputStyle}
                        />
                        {errors.stock && <span style={{ color: 'red', fontSize: '12px' }}>{errors.stock.message}</span>}
                    </div>

                    {/* หมวดหมู่ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label htmlFor="category" style={{ fontWeight: '500', fontSize: '14px', color: '#333' }}>หมวดหมู่</label>
                        <select
                            id="category"
                            {...register("category")}
                            style={inputStyle}
                        >
                            <option value="">กรุณาเลือกหมวดหมู่</option>
                            {CATEGORIES.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        {errors.category && <span style={{ color: 'red', fontSize: '12px' }}>{errors.category.message}</span>}
                    </div>

                    {/* คะแนนรีวิว */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                        <label htmlFor="rating" style={{ fontWeight: '500', fontSize: '14px', color: '#333' }}>คะแนนรีวิว (0 - 5)</label>
                        <input
                            id="rating"
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            placeholder="4.5"
                            {...register("rating", { valueAsNumber: true })}
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* ปุ่มควบคุม */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <button
                        type="submit"
                        disabled={!isDirty || !isValid} // ปุ่มจะถูกปิดใช้งานถ้าไม่มีการแก้ไขข้อมูล หรือข้อมูลไม่ผ่าน
                        style={{
                            padding: '9px 24px',
                            borderRadius: '4px',
                            border: 'none',
                            background: (!isDirty || !isValid) ? '#d9d9d9' : '#333',
                            color: '#fff',
                            cursor: (!isDirty || !isValid) ? 'not-allowed' : 'pointer',
                            fontWeight: '500',
                            height: '38px'
                        }}
                    >
                        {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                    </button>

                    {editing && (
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{
                                padding: '9px 20px',
                                borderRadius: '4px',
                                border: '1px solid #ff4d4f',
                                background: '#fff',
                                color: '#ff4d4f',
                                cursor: 'pointer',
                                fontWeight: '500',
                                height: '38px'
                            }}
                        >
                            ยกเลิก
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}